"""Exact requested replacements and narrow visual scope against the task snapshot."""
from dataclasses import asdict
from pathlib import Path
import json
import re
import unittest
from content_20min import SLIDES
from estimate import spoken_text

ROOT = Path(__file__).resolve().parent.parent
QA = ROOT / 'qa/20min/discours-demandes'


def sections(path: Path) -> dict[str, str]:
    return {m[1]: m[0] for m in re.finditer(
        r'<section class="slide[^\"]*" id="([^\"]+)"[^>]*>.*?</section>',
        path.read_text(), re.S)}


def visual(section: str) -> str:
    # Removing a slide renumbers positions. Notes are checked independently.
    section = re.sub(r' data-pos="[^"]*"', '', section)
    return re.sub(r'<aside class="notes">.*?</aside>', '', section, flags=re.S)


class RequestedDiscourseTests(unittest.TestCase):
    def test_every_replacement_is_exact(self) -> None:
        requested = json.loads((QA / 'remplacements.json').read_text())
        actual = {s.id: s.note for s in SLIDES}
        self.assertEqual({key: actual[key] for key in requested}, requested)

    def test_only_requested_slide_and_notes_change(self) -> None:
        before = json.loads((QA / 'slides-avant.json').read_text())
        removed = 'controle-publication'
        self.assertEqual(before[19]['id'], removed)
        self.assertEqual([s.id for s in SLIDES], [s['id'] for s in before if s['id'] != removed])
        requested = json.loads((QA / 'remplacements.json').read_text())
        for old in before:
            if old['id'] == removed:
                continue
            slide = next(s for s in SLIDES if s.id == old['id'])
            current = asdict(slide)
            current['mapping'] = list(current['mapping'])
            for field in old:
                if field == 'note' and slide.id in requested:
                    continue
                if field == 'seconds' and slide.id in requested:
                    continue
                if slide.id == 'secrets' and field in {'title', 'mapping'}:
                    continue
                self.assertEqual(old[field], current[field], f'{slide.id}.{field}')
        before_sections = sections(QA / 'before/deck.offline.html')
        after_sections = sections(ROOT / 'deck.offline.html')
        changed = [key for key in after_sections if visual(before_sections[key]) != visual(after_sections[key])]
        self.assertEqual(changed, ['secrets', 'validation'])

    def test_backup_reveal_removed_from_secrets_only(self) -> None:
        slide = next(s for s in SLIDES if s.id == 'secrets')
        section = sections(ROOT / 'deck.offline.html')['secrets']
        self.assertEqual(slide.steps, 2)
        self.assertNotRegex(slide.note, r'(?i)sauvegarde|restauration|copie externe')
        self.assertNotIn('class="data"', section)
        self.assertNotIn('class="sprint-marker"', section)
        self.assertNotIn('data-step="3"', section)

    def test_validation_panels_match_read_aloud_segments(self) -> None:
        section = sections(ROOT / 'deck.offline.html')['validation']
        for text in ['Parcours et droits vérifiés.', 'Restauration vérifiée.',
                     'Parcours métier et guide pour une stratégie RSE testés.',
                     'APK Android distribué par Azure Blob.']:
            self.assertIn(text, section)
        reference = sections(ROOT / 'build/reference-local.offline.html')['validation']
        def body(source: str) -> str:
            return visual(source).split('>', 1)[1].strip()
        self.assertEqual(body(section), body(reference))

    def test_reading_labels_are_directions_not_spoken_words(self) -> None:
        self.assertEqual(spoken_text('À lire : « Phrase visible. » [clic] (Pause.)'), '« Phrase visible. »  ')
        self.assertIn('<b>À lire :</b>', sections(ROOT / 'deck.offline.html')['validation'])


if __name__ == '__main__':
    unittest.main()
