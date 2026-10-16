"""Real HTTP contracts: ranges, native seeking prerequisites and file confinement."""
from __future__ import annotations

import sys
import tempfile
import threading
import unittest
from functools import partial
from http.server import ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request, urlopen

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from serve import RangeHandler, byte_range


class ServerTests(unittest.TestCase):
    def test_range_boundaries(self) -> None:
        self.assertEqual(byte_range('bytes=2-4', 10), (2, 4))
        self.assertEqual(byte_range('bytes=7-', 10), (7, 9))
        self.assertEqual(byte_range('bytes=-3', 10), (7, 9))
        self.assertEqual(byte_range('bytes=0-999', 10), (0, 9))
        for value in ['bytes=10-', 'bytes=4-2', 'bytes=-0', 'bytes=0-1,3-4', 'bytes=']:
            with self.assertRaises(ValueError):
                byte_range(value, 10)

    def test_http_ranges_and_source_confinement(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory) / 'dist'
            root.mkdir()
            (root / 'film.mp4').write_bytes(b'0123456789')
            secret = Path(directory) / 'source.txt'
            secret.write_text('not served')
            (root / 'external.txt').symlink_to(secret)
            handler = partial(RangeHandler, directory=str(root))
            with ThreadingHTTPServer(('127.0.0.1', 0), handler) as server:
                thread = threading.Thread(target=server.serve_forever, daemon=True)
                thread.start()
                base = f'http://127.0.0.1:{server.server_port}'
                try:
                    with urlopen(Request(base + '/film.mp4', headers={'Range': 'bytes=3-6'})) as response:
                        self.assertEqual(response.status, 206)
                        self.assertEqual(response.headers['Content-Range'], 'bytes 3-6/10')
                        self.assertEqual(response.headers['Content-Length'], '4')
                        self.assertEqual(response.headers['Accept-Ranges'], 'bytes')
                        self.assertEqual(response.read(), b'3456')
                    with urlopen(Request(base + '/film.mp4', method='HEAD', headers={'Range': 'bytes=-2'})) as response:
                        self.assertEqual(response.status, 206)
                        self.assertEqual(response.read(), b'')
                    for name, code, headers in [('external.txt', 403, {}), ('source.txt', 404, {}), ('film.mp4', 416, {'Range': 'bytes=11-'})]:
                        with self.assertRaises(HTTPError) as error:
                            urlopen(Request(base + '/' + name, headers=headers))
                        self.assertEqual(error.exception.code, code)
                        error.exception.close()
                finally:
                    server.shutdown()
                    thread.join()


if __name__ == '__main__':
    unittest.main()
