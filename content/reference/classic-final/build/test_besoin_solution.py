"""Accepted need/solution correction remains intact during followup edits."""
from dataclasses import asdict
from pathlib import Path
import json
import re
import unittest
from content_20min import SLIDES
from estimate import timing

ROOT=Path(__file__).resolve().parent.parent

class NeedSolutionTests(unittest.TestCase):
    def test_need_solution_preserved_by_followup_edits(self) -> None:
        # The later requested discourse edits legitimately affect other slides.
        # Keep the original scope snapshot; compare this slide to the newer task
        # baseline, which already contains the accepted need/solution correction.
        before=json.loads((ROOT/'qa/20min/discours-demandes/slides-avant.json').read_text())
        current=asdict(next(s for s in SLIDES if s.id=='probleme'))
        current['mapping']=list(current['mapping'])
        self.assertEqual(next(s for s in before if s['id']=='probleme'),current)
        def section(path: Path) -> str:
            return re.search(r'<section class="slide[^\"]*" id="probleme"[^>]*>.*?</section>',path.read_text(),re.S)[0]
        self.assertEqual(section(ROOT/'qa/20min/discours-demandes/before/deck.offline.html'),section(ROOT/'deck.offline.html'))

    def test_exact_note_has_one_click_and_no_added_claims(self) -> None:
        slide=next(s for s in SLIDES if s.id=='probleme')
        self.assertEqual(slide.title,'Du besoin à la solution ZAWEDNI')
        self.assertEqual(slide.steps,1)
        self.assertEqual(slide.note.count('[clic]'),1)
        self.assertNotRegex(slide.note,r'(?i)certif|garant')
        self.assertGreaterEqual(timing(slide).pause,3.2)
        self.assertIn('rendus visibles après validation de leur dossier',slide.note)
        self.assertIn('recommandations, le guide RSE et le rapport ESG',slide.note)

    def test_solution_and_three_points_share_one_reveal(self) -> None:
        source=(ROOT/'build/short.sections.html').read_text().split('</section>',1)[0]
        self.assertIn('<div class="solution" data-step="1" data-anim="rise">',source)
        self.assertEqual(source.count('data-step='),1)
        self.assertEqual(source.count('<strong>'),3)
        self.assertNotRegex(source,r'<ol|<li|data-stagger')
        self.assertNotRegex(source,r'(?i)certif|garant')

if __name__=='__main__': unittest.main()
