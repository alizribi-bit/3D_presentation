"""Loopback-only static server with bounded byte ranges for native video seeking.

The stdlib's plain static server ignores Range, causing Chromium to expose a
zero-length seekable interval. Only the independent dist is served; no source,
external symlink or parent path can be reached. Multiple ranges are rejected.
"""
from __future__ import annotations

import argparse
import re
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import BinaryIO


def byte_range(value: str, size: int) -> tuple[int, int]:
    match = re.fullmatch(r'bytes=(\d*)-(\d*)', value)
    if not match or not any(match.groups()) or size <= 0:
        raise ValueError('Invalid range')
    start_text, end_text = match.groups()
    if not start_text:
        suffix = int(end_text)
        if suffix <= 0:
            raise ValueError('Empty suffix')
        return max(0, size - suffix), size - 1
    start = int(start_text)
    end = min(int(end_text), size - 1) if end_text else size - 1
    if start >= size or end < start:
        raise ValueError('Unsatisfiable range')
    return start, end


class RangeHandler(SimpleHTTPRequestHandler):
    server_version = 'ZawedniRange/1.0'
    selected_range: tuple[int, int] | None = None

    def send_head(self) -> BinaryIO | None:
        self.selected_range = None
        target = Path(self.translate_path(self.path)).resolve()
        root = Path(self.directory).resolve()
        if not target.is_relative_to(root):
            self.send_error(403)
            return None
        requested = self.headers.get('Range')
        if not requested or not target.is_file():
            return super().send_head()
        # Open before stat so concurrent file replacement cannot mismatch length and body.
        try:
            stream = target.open('rb')
        except OSError:
            self.send_error(404)
            return None
        import os
        info = os.fstat(stream.fileno())
        try:
            start, end = byte_range(requested, info.st_size)
        except ValueError:
            stream.close()
            self.send_response(416)
            self.send_header('Content-Range', f'bytes */{info.st_size}')
            self.send_header('Content-Length', '0')
            self.end_headers()
            return None
        self.selected_range = start, end
        stream.seek(start)
        self.send_response(206)
        self.send_header('Content-Type', self.guess_type(str(target)))
        self.send_header('Content-Range', f'bytes {start}-{end}/{info.st_size}')
        self.send_header('Content-Length', str(end - start + 1))
        self.send_header('Last-Modified', self.date_time_string(info.st_mtime))
        self.end_headers()
        return stream

    def end_headers(self) -> None:
        self.send_header('Accept-Ranges', 'bytes')
        self.send_header('X-Content-Type-Options', 'nosniff')
        super().end_headers()

    def copyfile(self, source: BinaryIO, outputfile: BinaryIO) -> None:
        try:
            self.copy_stream(source, outputfile)
        except (BrokenPipeError, ConnectionResetError):
            # Leaving or seeking a native video cancels its previous stream normally.
            self.close_connection = True

    def copy_stream(self, source: BinaryIO, outputfile: BinaryIO) -> None:
        if self.selected_range is None:
            super().copyfile(source, outputfile)
            return
        remaining = self.selected_range[1] - self.selected_range[0] + 1
        while remaining > 0:
            block = source.read(min(64 * 1024, remaining))
            if not block:
                break
            outputfile.write(block)
            remaining -= len(block)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', type=int, default=4320)
    parser.add_argument('--directory', type=Path, required=True)
    args = parser.parse_args()
    if not 1024 <= args.port <= 65535 or not args.directory.is_dir():
        parser.error('Expected a valid directory and non-privileged port')
    handler = partial(RangeHandler, directory=str(args.directory.resolve()))
    with ThreadingHTTPServer(('127.0.0.1', args.port), handler) as server:
        server.serve_forever()
