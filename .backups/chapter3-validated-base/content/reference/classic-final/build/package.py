"""Package the classic presentation with its active sources, excluding historical build copies."""

from pathlib import Path
import shutil
from zipfile import ZIP_DEFLATED, ZipFile

ROOT = Path(__file__).resolve().parent.parent
ARCHIVE = ROOT.parent / "soutenance-v9.zip"


def delivery_files() -> list[Path]:
    files = [path for path in ROOT.iterdir() if path.is_file() and path.name != "VERIFICATION_V8.md"]
    for folder in ("assets", "media", ".slides", "qa/v9"):
        files.extend(path for path in (ROOT / folder).rglob("*") if path.is_file())
    files.extend(path for path in (ROOT / "build").iterdir()
                 if path.is_file() and (path.suffix in {".js", ".mjs", ".py"} or path.name.endswith(".sections.html")))
    for path in files:
        if path.is_symlink() or not path.resolve().is_relative_to(ROOT):
            raise ValueError(f"Delivery file outside the project: {path}")
    return sorted(files)


if __name__ == "__main__":
    files = delivery_files()
    with ZipFile(ARCHIVE, "w", compression=ZIP_DEFLATED, compresslevel=6) as archive:
        for path in files:
            archive.write(path, path.relative_to(ROOT.parent))
    shutil.copyfile(ARCHIVE, ROOT.parent / "soutenance.zip")
    print(f"{ARCHIVE}: {len(files)} files, {ARCHIVE.stat().st_size / (1024 * 1024):.1f} MiB")
