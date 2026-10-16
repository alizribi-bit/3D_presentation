"""Regression tests for timing cues and the portable launcher, without launching Chrome."""

import os
import hashlib
import json
from pathlib import Path
import subprocess
import tempfile
import unittest

from estimate import estimate, spoken_text, word_count
from script_rows import R
from package import delivery_files

ROOT = Path(__file__).resolve().parent.parent


class DeliveryTests(unittest.TestCase):
    def test_archive_contains_active_sources_and_no_backup_directories(self) -> None:
        files = {str(path.relative_to(ROOT)) for path in delivery_files()}
        self.assertTrue({'build/G.js', 'build/K.sections.html', 'build/script_rows.py',
                         'deck.offline.html', 'media/zawedni-devsecops.mp4'}.issubset(files))
        self.assertFalse(any('before-' in file or 'backups/' in file or '__pycache__/' in file for file in files))

    def test_accepted_media_and_untargeted_speech_are_unchanged(self) -> None:
        baseline = json.loads((ROOT / 'qa/v9/preservation.json').read_text(encoding='utf-8'))
        for relative, digest in baseline['assets'].items():
            with self.subTest(file=relative):
                path = ROOT / relative
                self.assertTrue(path.resolve().is_relative_to(ROOT))
                self.assertEqual(hashlib.sha256(path.read_bytes()).hexdigest(), digest)
        for row in R:
            if row[0] in baseline['untouched_rows']:
                with self.subTest(slide=row[0]):
                    self.assertEqual(hashlib.sha256(repr(row).encode()).hexdigest(),
                                     baseline['untouched_rows'][row[0]])
        # Two new journey reveals minus the former problem-slide reveal.
        self.assertEqual(estimate(R).clicks, baseline['original_clicks'] + 1)

    def test_silent_film_direction_is_not_counted_as_speech(self) -> None:
        self.assertEqual(spoken_text("Annonce. [clic] (Laisser jouer le film.)"), "Annonce.  ")
        self.assertEqual(word_count(spoken_text("[lire] « Livraison automatisée. »")), 2)

    def test_script_reveal_count_matches_every_note_segment(self) -> None:
        for row in R:
            with self.subTest(slide=row[0]):
                self.assertEqual(row[7].count(" [clic] "), row[3])
        result = estimate(R)
        self.assertEqual(result.slides, 44)
        self.assertEqual(result.clicks, sum(row[7].count(" [clic] ") for row in R))
        self.assertEqual({row[0]: row[3] for row in R if row[0] in {"problematique", "sequence", "parcours-app"}},
                         {"problematique": 1, "sequence": 2, "parcours-app": 4})
        self.assertEqual(result.film_seconds, 90)
        self.assertGreater(result.total_seconds, 20 * 60)

    def launcher(self, screens: str, arguments: list[str]) -> list[str]:
        with tempfile.TemporaryDirectory() as directory:
            tmp = Path(directory)
            # PATH stubs avoid real process termination, display access and browser launch.
            scripts = {
                "pkill": "#!/bin/bash\nexit 1\n",
                "xrandr": "#!/bin/bash\ncat <<'SCREENS'\n" + screens + "\nSCREENS\n",
                "google-chrome": '#!/bin/bash\nprintf "%s\\n" "$@" > "$LAUNCH_TEST_ARGS"\n',
            }
            for name, content in scripts.items():
                executable = tmp / name
                executable.write_text(content, encoding="utf-8")
                executable.chmod(0o755)
            output = tmp / "args"
            # Preserve HOME; the configurable browser profile keeps test writes in /tmp.
            environment = dict(os.environ, PATH=f"{tmp}:{os.environ['PATH']}",
                               ZAWEDNI_CHROME_PROFILE=str(tmp / "profile"), LAUNCH_TEST_ARGS=str(output))
            subprocess.run(["bash", str(ROOT / "presenter.sh"), *arguments], env=environment,
                           check=True, capture_output=True, text=True)
            return output.read_text(encoding="utf-8").splitlines()

    def test_single_display_opens_the_offline_deck(self) -> None:
        args = self.launcher("eDP-1 connected 1920x1080+0+0", [])
        self.assertEqual(args, [str(ROOT / "deck.offline.html")])

    def test_two_displays_keep_notes_on_laptop_and_accept_absolute_paths(self) -> None:
        args = self.launcher("eDP-1 connected 1920x1080+0+1080\nHDMI-1 connected 1920x1080+0+0",
                             [str(ROOT / "deck.offline.html")])
        self.assertIn("--window-position=0,0", args)
        self.assertEqual(args[-1], f"file://{ROOT}/deck.offline.html?pv=0,1080,1920,1080")

    def test_swap_reverses_display_roles(self) -> None:
        args = self.launcher("eDP-1 connected 1920x1080+0+1080\nHDMI-1 connected 1920x1080+0+0", ["--swap"])
        self.assertIn("--window-position=0,1080", args)
        self.assertTrue(args[-1].endswith("?pv=0,0,1920,1080"))


if __name__ == "__main__":
    unittest.main()
