"""Contracts for evidence visibility and unchanged delivery behaviour."""
from __future__ import annotations
import hashlib
import json
from pathlib import Path
import unittest
from screenshot_layouts import SHOTS, Rect, Screenshot, _replace_image

ROOT=Path(__file__).resolve().parent.parent

class ScreenshotTests(unittest.TestCase):
    def test_all_highlights_remain_inside_their_real_crop(self) -> None:
        for screenshot in SHOTS.values(): screenshot.validate()

    def test_ci_commit_and_success_are_both_in_view(self) -> None:
        crop=SHOTS['run'].crop
        for x,y in [(455,127),(620,127),(750,127)]:
            self.assertTrue(crop.x<=x<crop.x+crop.width and crop.y<=y<crop.y+crop.height)

    def test_manifest_keeps_bot_identity_and_updated_reference(self) -> None:
        self.assertEqual(SHOTS['manifest-author'].source,SHOTS['manifest-image'].source)
        self.assertLess(SHOTS['manifest-author'].crop.y,56)
        self.assertGreater(SHOTS['manifest-author'].crop.y+SHOTS['manifest-author'].crop.height,97)
        self.assertLess(SHOTS['manifest-image'].crop.y,394)
        self.assertGreater(SHOTS['manifest-image'].crop.y+SHOTS['manifest-image'].crop.height,426)

    def test_out_of_source_crop_is_rejected(self) -> None:
        shot=Screenshot('invalid','assets/none.jpg',100,100,Rect(50,50,60,60),100,'Test')
        with self.assertRaises(ValueError): shot.render()

    def test_greater_than_in_alt_does_not_leave_broken_markup(self) -> None:
        original='<div><img src="x.jpg" alt="Rule: rate > 0.1"></div>'
        self.assertEqual(_replace_image('Rule:','<div>proof</div>',original),'<div><div>proof</div></div>')

    def test_accepted_video_player_unchanged(self) -> None:
        baseline=json.loads((ROOT/'qa/20min/polish/unchanged.json').read_text())
        name='build/E.js'
        self.assertEqual(hashlib.sha256((ROOT/name).read_bytes()).hexdigest(),baseline[name],name)

if __name__=='__main__': unittest.main()
