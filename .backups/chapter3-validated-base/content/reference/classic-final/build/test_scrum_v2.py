"""The generated Scrum illustration replaces only the first methodology state."""
from pathlib import Path
import hashlib
import json
import re
import struct
import unittest

ROOT=Path(__file__).resolve().parent.parent

class ScrumIllustrationTests(unittest.TestCase):
    def test_player_and_frozen_reference_are_unchanged(self) -> None:
        baseline=json.loads((ROOT/'qa/20min/scrum-v2/unchanged.json').read_text())
        for name in ['build/E.js','build/reference-local.offline.html']:
            self.assertEqual(hashlib.sha256((ROOT/name).read_bytes()).hexdigest(),baseline[name],name)

    def test_illustration_is_a_local_wide_png(self) -> None:
        data=(ROOT/'assets/scrum-cycle-zawedni-v2.png').read_bytes()
        self.assertEqual(data[:8],b'\x89PNG\r\n\x1a\n')
        width,height=struct.unpack('>II',data[16:24])
        self.assertGreater(width,1600)
        self.assertGreater(width/height,2.2)
        self.assertLess(width/height,2.5)
        self.assertFalse((ROOT/'assets/scrum-cycle-zawedni-v2.png').is_symlink())

    def test_first_state_has_the_image_and_second_has_original_releases(self) -> None:
        def section(source: str) -> str:
            return re.search(r'<section[^>]*id="methodologie"[^>]*>(.*?)</section>',source,re.S)[1]
        actual=section((ROOT/'deck.offline.html').read_text())
        reference=section((ROOT/'build/reference-local.offline.html').read_text())
        self.assertNotIn('<svg class="scrum-diagram"',actual)
        self.assertRegex(actual,r'<figure class="scrum-diagram" data-out="1"')
        self.assertRegex(actual,r'<img src="data:image/png;base64,')
        def releases(block: str) -> str:
            return block[block.index('<div class="panel" data-step="1"'):block.index('<aside class="notes">')].strip()
        self.assertEqual(releases(actual),releases(reference))
        self.assertEqual(actual.count('class="box release"'),3)

if __name__=='__main__': unittest.main()
