"""Contracts for the targeted v9 correction, using the preserved pre-correction baseline."""
import hashlib
import json
from pathlib import Path
import re
import unittest
from typing import cast

from script_rows import R

ROOT = Path(__file__).resolve().parent.parent
BASELINE = ROOT / "qa/v9/correction-14-15/baseline.json"


def digest(path: Path) -> str:
    with path.open("rb") as source:
        return hashlib.file_digest(source, "sha256").hexdigest()


def sections(text: str) -> dict[str, str]:
    return {match[1]: match[0] for match in re.finditer(
        r'<section class="slide[^\"]*" id="([^\"]+)".*?</section>', text, re.S)}


class CorrectionTests(unittest.TestCase):
    def setUp(self) -> None:
        self.baseline = json.loads(BASELINE.read_text(encoding="utf-8"))
        self.fragment = sections((ROOT / "build/I.sections.html").read_text(encoding="utf-8"))

    def test_sequence_preserves_four_participants_and_v8_sequence_grammar(self) -> None:
        diagram = self.fragment["sequence"]
        names = re.findall(r'<p class="who[^\"]*"[^>]*>(.*?)</p>', diagram)
        self.assertEqual(names, ["Entreprise", "API Spring Boot", "PostgreSQL", "Administrateur"])
        self.assertIn('class="lifelines"', diagram)
        self.assertIn('class="alternative"', diagram)
        self.assertEqual(diagram.count('class="stage"'), 3)
        self.assertNotIn('class="lanes"', diagram)
        for caption in ["Créer son compte", "Attribuer / envoyer la grille", "Remplir la grille",
                        "Soumettre la grille", "Examiner les réponses", "Approuver ou rejeter la grille",
                        "Grille approuvée ?", "ACCÈS AUTORISÉ", "ACCÈS REFUSÉ"]:
            with self.subTest(caption=caption):
                self.assertIn(caption, diagram)

    def test_assignment_is_a_real_image_in_admin_view_without_phone(self) -> None:
        journey = self.fragment["parcours-app"]
        entry = journey.split('data-state="0"', 1)[1].split('data-state="1"', 1)[0]
        self.assertIn('src="assets/v9-adm-attribution.png"', entry)
        self.assertNotIn('class="business"', journey)
        for forbidden in ['class="ph"', 'class="mob"', 'class="apk"']:
            self.assertNotIn(forbidden, entry)
        self.assertEqual(journey.count('data-state="'), 5)
        receipt = json.loads((ROOT / "qa/v9/correction-14-15/capture.json").read_text())
        self.assertEqual(digest(ROOT / "assets/v9-adm-attribution.png"), receipt["sha256"])
        self.assertEqual(receipt["assignment_count_before"], receipt["assignment_count_after"])
        self.assertEqual(receipt["write_requests"], [{"method": "POST", "path": "/api/auth/login"}])

    def test_every_v9_note_and_all_other_rows_are_unchanged(self) -> None:
        notes = cast(dict[str, str], self.baseline["notes"])
        rows = cast(dict[str, str], self.baseline["untouched_rows"])
        for row in R:
            with self.subTest(slide=row[0]):
                self.assertEqual(hashlib.sha256(row[7].encode()).hexdigest(), notes[row[0]])
                if row[0] in rows:
                    self.assertEqual(hashlib.sha256(repr(row).encode()).hexdigest(), rows[row[0]])

    def test_four_later_interface_states_are_unchanged(self) -> None:
        journey = self.fragment["parcours-app"]
        marks = list(re.finditer(r'<div class="state[^>]*data-state="([0-4])"', journey))
        for index, match in enumerate(marks):
            if match[1] == "0":
                continue
            end = marks[index + 1].start() if index + 1 < len(marks) else journey.index('<ol class="rail">')
            with self.subTest(step=match[1]):
                self.assertEqual(hashlib.sha256(journey[match.start():end].encode()).hexdigest(),
                                 self.baseline["later_interface_states"][match[1]])

    def test_other_fragments_scripts_images_and_film_are_unchanged(self) -> None:
        originals = cast(dict[str, str], self.baseline["sections"])
        for path in (ROOT / "build").glob("*.sections.html"):
            for sid, content in sections(path.read_text(encoding="utf-8")).items():
                if sid not in {"sequence", "parcours-app"}:
                    with self.subTest(slide=sid):
                        self.assertEqual(hashlib.sha256(content.encode()).hexdigest(), originals[sid])
        for group in ["source_files", "assets"]:
            for relative, expected in cast(dict[str, str], self.baseline[group]).items():
                with self.subTest(file=relative):
                    path = ROOT / relative
                    self.assertTrue(path.resolve().is_relative_to(ROOT))
                    self.assertEqual(digest(path), expected)

    def test_all_42_other_rendered_slides_are_unchanged(self) -> None:
        originals = cast(dict[str, str], self.baseline["rendered_sections"])
        rendered = sections((ROOT / "deck.html").read_text(encoding="utf-8"))
        self.assertEqual(len(rendered), 44)
        for sid, content in rendered.items():
            if sid not in {"sequence", "parcours-app"}:
                with self.subTest(slide=sid):
                    self.assertEqual(hashlib.sha256(content.encode()).hexdigest(), originals[sid])


if __name__ == "__main__":
    unittest.main()
