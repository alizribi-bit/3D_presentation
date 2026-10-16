"""Delivery invariants: preservation, independent assets, timing and safe notes."""
from __future__ import annotations
import hashlib
import json
from pathlib import Path
import re
import unittest
import tempfile
import shutil
import subprocess
import os
from build_20min import inline_images, notes
from content_20min import SLIDES, TARGET_SECONDS, WORDS_PER_MINUTE, FILM_SECONDS
from estimate import timing, spoken_text, word_count

ROOT = Path(__file__).resolve().parent.parent
WORKSPACE = ROOT.parent

def sha256(path: Path) -> str:
    digest=hashlib.sha256()
    with path.open('rb') as stream:
        for chunk in iter(lambda:stream.read(1024*1024),b''): digest.update(chunk)
    return digest.hexdigest()

class DeliveryTests(unittest.TestCase):
    def test_originals_unchanged(self) -> None:
        baseline=json.loads((ROOT/'qa/20min/originaux-avant.json').read_text())
        changed=[name for name,value in baseline.items() if not (WORKSPACE/name).is_file() or sha256(WORKSPACE/name)!=value]
        self.assertEqual(changed,[])
        for folder in ['soutenance','presentation','presentation-releases','presentation-sprint6','zawedni-story-3d','scene']:
            current={str(p.relative_to(WORKSPACE)) for p in (WORKSPACE/folder).rglob('*') if p.is_file()}
            self.assertEqual(current,{n for n in baseline if n.startswith(folder+'/')})
        (ROOT/'qa/20min/preservation-result.json').write_text(json.dumps({'files':len(baseline),'changed':changed,'membership':'unchanged','status':'PASS'},indent=2))

    def test_assets_and_film_unchanged(self) -> None:
        initial=json.loads((ROOT/'qa/20min/copie-initiale.json').read_text())
        selected={n:h for n,h in initial.items() if n.startswith(('assets/','media/'))}
        self.assertGreater(len(selected),70)
        self.assertEqual([n for n,h in selected.items() if sha256(ROOT/n)!=h],[])

    def test_reference_contains_local_edits(self) -> None:
        initial=json.loads((ROOT/'qa/20min/copie-initiale.json').read_text())
        self.assertEqual(sha256(ROOT/'build/reference-local.offline.html'),initial['deck.offline.html'])
        self.assertEqual(initial['DISCOURS.md'],sha256(WORKSPACE/'soutenance/DISCOURS.md'))

    def test_launch_is_independent(self) -> None:
        self.assertFalse(any(p.is_symlink() for p in ROOT.rglob('*')))
        source=(ROOT/'deck.offline.html').read_text()
        self.assertNotRegex(source,r'(?:src|href)=["\'](?:\.\./|https?://)')
        self.assertNotIn('pkill',(ROOT/'presenter.sh').read_text())
        self.assertIn('zawedni-classique-20min-chrome',(ROOT/'presenter.sh').read_text())
        self.assertTrue((ROOT/'media/zawedni-devsecops.mp4').is_file())

    def test_launcher_selects_copy_even_with_spaces(self) -> None:
        with tempfile.TemporaryDirectory(prefix='zawedni-launch-') as temporary:
            base=Path(temporary); directory=base/'copy with spaces'; directory.mkdir()
            shutil.copy2(ROOT/'lancer.sh',directory/'lancer.sh')
            shutil.copy2(ROOT/'lancer_discours.sh',directory/'lancer_discours.sh')
            mock=base/'google-chrome'
            mock.write_text('#!/usr/bin/env bash\nprintf "%s\\n" "$@" > "$ZAWEDNI_TEST_ARGS"\n')
            mock.chmod(0o755)
            log=base/'arguments'
            environment={**os.environ,'PATH':str(base)+':'+os.environ['PATH'],'ZAWEDNI_TEST_ARGS':str(log)}
            for option,target in [([], 'deck.offline.html'),(['--film'],'film.html'),(['--discours'],'discours.html')]:
                subprocess.run(['bash','lancer.sh',*option],cwd=directory,env=environment,check=True)
                self.assertEqual(log.read_text().strip(),str(directory/target))
            self.assertEqual(subprocess.run(['bash','lancer.sh','--unknown'],cwd=directory,env=environment,capture_output=True).returncode,2)
            subprocess.run([str(directory/'lancer_discours.sh')],cwd=base,env=environment,check=True)
            self.assertEqual(log.read_text().strip(),str(directory/'discours.html'))

    def test_timing_includes_every_reveal(self) -> None:
        self.assertEqual(sum(s.seconds for s in SLIDES),TARGET_SECONDS)
        for s in SLIDES:
            self.assertEqual(s.note.count('[clic]'),s.steps)
            self.assertGreaterEqual(s.seconds,timing(s).speech+s.film_seconds)
        pauses=sum(timing(s).pause for s in SLIDES)
        self.assertGreater(pauses,(len(SLIDES)-1)*2+sum(s.steps for s in SLIDES)*1.2)
        self.assertEqual(sum(s.film_seconds for s in SLIDES),FILM_SECONDS)
        self.assertIn('video',[s.id for s in SLIDES])
        slow=sum(timing(s,105).speech for s in SLIDES)+FILM_SECONDS+pauses
        self.assertLess(slow,1200)

    def test_useful_motion_is_not_frozen(self) -> None:
        runtime=(ROOT/'build/compact-runtime.js').read_text()
        self.assertNotIn('source_state',runtime)
        self.assertNotIn('t:Infinity',runtime)
        restored={'methodologie','outils-infra','routage','secrets','blocage','journaux','video'}
        self.assertTrue(restored.issubset({s.id for s in SLIDES}))
        for s in SLIDES:
            self.assertEqual(sorted(set(s.mapping)),list(range(s.steps+1)),s.id)
        self.assertEqual(sum(s.steps for s in SLIDES),51)
        model=(ROOT/'deck.offline.html').read_text()
        self.assertIn('<script data-batch="E">',model)
        self.assertIn('data-transition="dip"',model)
        self.assertNotIn('id="sequence" data-pos=',model)
        self.assertNotIn('id="parcours-app" data-pos=',model)

    def test_notes_escape_untrusted_markup(self) -> None:
        rendered=notes('</p><script>alert(1)</script> [clic] <img src=x onerror=alert(2)>')
        self.assertNotIn('<script>',rendered)
        self.assertNotIn('<img',rendered)
        self.assertIn('&lt;script&gt;',rendered)
        self.assertIn('data-step="1"',rendered)

    def test_assets_cannot_escape_copy(self) -> None:
        with self.assertRaises(ValueError): inline_images('<img src="assets/../../soutenance/assets/logo.png">')

    def test_rebuild_works_without_original_project(self) -> None:
        with tempfile.TemporaryDirectory(prefix='zawedni-20min-') as temporary:
            copy=Path(temporary)/'ZAWEDNI_CLASSIQUE_20MIN'
            copy.mkdir()
            for name in ['build','assets','media']:
                shutil.copytree(ROOT/name,copy/name,ignore=shutil.ignore_patterns('before-*','__pycache__'))
            for name in ['rebuild.sh','build_discours.py']:
                shutil.copy2(ROOT/name,copy/name)
            subprocess.run(['bash','rebuild.sh'],cwd=copy,check=True,capture_output=True)
            for name in ['deck.offline.html','deck.html','SCRIPT_ORAL_18MIN.md','discours.html']:
                self.assertEqual(sha256(copy/name),sha256(ROOT/name),name)

    def test_original_perspectives_and_explicit_exclusions(self) -> None:
        ids=[s.id for s in SLIDES]
        self.assertEqual(len(SLIDES),35)
        for id in ['controle-publication','ch2','outils-dev','plateforme','sequence','parcours-app','acteurs','apercu','alerte','perspectives','objectifs']: self.assertNotIn(id,ids)
        for id in ['log4j','argocd','tracabilite','modele','startup','limites','dix-pipelines','devsecops']: self.assertIn(id,ids)
        reference=(ROOT/'build/reference-local.offline.html').read_text()
        output=(ROOT/'deck.offline.html').read_text()
        def body(document: str) -> str:
            section=re.search(r'<section[^>]*id="limites"[^>]*>(.*?)</section>',document,re.S)[1]
            return re.sub(r'<aside class="notes">.*?</aside>','',section,flags=re.S).strip()
        self.assertEqual(body(reference),body(output))
        self.assertEqual(len(re.findall(r'<li>',body(output))),9)
        self.assertEqual(next(s.steps for s in SLIDES if s.id=='limites'),3)
        self.assertNotRegex(' '.join(s.note for s in SLIDES),r'\bDevOps\b')

    def test_original_clicks_preserved(self) -> None:
        reference=(ROOT/'build/reference-local.offline.html').read_text()
        for slide in SLIDES:
            if slide.id in ['ch1','modele','secrets']: continue
            section=re.search(r'<section[^>]*id="'+slide.id+r'"[^>]*>(.*?)</section>',reference,re.S)[1]
            aside=re.search(r'<aside class="notes">(.*?)</aside>',section,re.S)[1]
            self.assertEqual(slide.steps,len(re.findall(r'<p(?: |>)',aside))-1,slide.id)
            self.assertEqual(slide.mapping,tuple(range(slide.steps+1)))
            self.assertGreaterEqual(timing(slide).pause,2+slide.steps*1.2)

    def test_bmc_has_only_two_simultaneous_focuses(self) -> None:
        source=(ROOT/'deck.offline.html').read_text()
        section=re.search(r'<section[^>]*id="modele"[^>]*>(.*?)</section>',source,re.S)[1]
        self.assertEqual(re.findall(r'data-bmc-focus="([^"]+)"',section),['value','clients'])
        self.assertNotRegex(section,r'data-step="[2-9]"|data-out="[2-9]"')
        bmc=next(s for s in SLIDES if s.id=='modele')
        self.assertEqual(bmc.steps,1)
        self.assertNotRegex(bmc.note,r'(?i)revenu|abonnement|publicit')

    def test_reader_speech_matches_every_current_note(self) -> None:
        source=(ROOT/'discours.html').read_text()
        data=json.loads(re.search(r'const DATA = (.*?);\n',source)[1])
        self.assertEqual(len(data['slides']),len(SLIDES))
        for entry,slide in zip(data['slides'],SLIDES):
            self.assertEqual(entry['title'],slide.title)
            self.assertEqual(len(entry['steps']),slide.steps+1)
            for step,note in zip(entry['steps'],slide.note.split(' [clic] ')):
                actual=' '.join('('+line['x']+')' if line['t']=='dir' else line['x'] for line in step)
                self.assertEqual(actual,note,slide.id)

if __name__=='__main__': unittest.main()
