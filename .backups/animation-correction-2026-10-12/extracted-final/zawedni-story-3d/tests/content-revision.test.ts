import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { FULL_STATES, speechNotes } from '../src/story/itinerary.ts';
import sequences from '../content/source/sequences.json' with { type: 'json' };
import reference from '../content/reference/manifest.json' with { type: 'json' };

test('Sequence count and state totals', () => {
  assert.equal(sequences.length, reference.counts.slides);
  assert.equal(FULL_STATES.length, reference.counts.states);
});

test('Chapter 1 extension sequences exist and are ordered after modele and before ch2', () => {
  const ids = sequences.map(s => s.id);
  const modeleIdx = ids.indexOf('modele');
  const probIdx = ids.indexOf('problematique');
  const besIdx = ids.indexOf('besoins');
  const methIdx = ids.indexOf('methodologie');
  const ch2Idx = ids.indexOf('ch2');

  assert.ok(modeleIdx !== -1, 'modele must exist');
  assert.equal(probIdx, modeleIdx + 1, 'problematique must immediately follow modele');
  assert.equal(besIdx, modeleIdx + 2, 'besoins must immediately follow problematique');
  assert.equal(methIdx, modeleIdx + 3, 'methodologie must immediately follow besoins');
  assert.equal(ch2Idx, modeleIdx + 4, 'ch2 must follow methodologie');

  // Check chapters
  assert.equal(sequences[probIdx]!.chapter, 1);
  assert.equal(sequences[besIdx]!.chapter, 1);
  assert.equal(sequences[methIdx]!.chapter, 1);
});

test('Specific sequence step numbers and states', () => {
  const seqItem = sequences.find(s => s.id === 'sequence');
  assert.ok(seqItem);
  assert.equal(seqItem.steps, 2, 'sequence has 3 states (steps = 2)');

  const parcoursItem = sequences.find(s => s.id === 'parcours-app');
  assert.ok(parcoursItem);
  assert.equal(parcoursItem.steps, 4, 'parcours-app has 5 states (steps = 4)');

  const alerteItem = sequences.find(s => s.id === 'alerte');
  assert.ok(alerteItem);
  assert.equal(alerteItem.steps, 2, 'alerte has 3 states (steps = 2)');
});

test('Evidence JSON files exist and have matching frame count for all sequences', () => {
  for (const seq of sequences) {
    const filePath = `public/content/${seq.id}.json`;
    assert.ok(existsSync(filePath), `Evidence file must exist for ${seq.id}`);
    const data = JSON.parse(readFileSync(filePath, 'utf8'));
    assert.equal(data.id, seq.id, `ID mismatch in ${seq.id}`);
    assert.equal(data.frames.length, seq.steps + 1, `Frame count mismatch for ${seq.id}`);
  }
});

test('Speech exactness for modified and added sequences', () => {
  // startup
  const startup = sequences.find(s => s.id === 'startup');
  assert.ok(startup);
  assert.ok(startup.speech[0]!.includes("SARL"));
  assert.ok(startup.speech[0]!.includes("décembre 2025"));

  // problematique
  const prob = sequences.find(s => s.id === 'problematique');
  assert.ok(prob);
  assert.ok(prob.speech[1]!.includes("Comment concevoir une plateforme web et mobile fluide et fiable, de son développement à son exploitation ?"));

  // besoins
  const bes = sequences.find(s => s.id === 'besoins');
  assert.ok(bes);
  assert.ok(bes.speech[0]!.includes("La plateforme couvre"));
  assert.ok(bes.speech[0]!.includes("DevSecOps"));

  // methodologie
  const meth = sequences.find(s => s.id === 'methodologie');
  assert.ok(meth);
  assert.ok(meth.speech[1]!.includes("Release 1 : préparer l'environnement"));
  assert.ok(meth.speech[1]!.includes("Release 2 : automatiser la livraison"));
  assert.ok(meth.speech[1]!.includes("Release 3 : suivre et protéger les services"));

  // sequence
  const seq = sequences.find(s => s.id === 'sequence');
  assert.ok(seq);
  assert.ok(seq.speech[0]!.includes("Pour utiliser ZAWEDNI, l'entreprise commence par créer son compte"));
  assert.ok(seq.speech[1]!.includes("L'entreprise remplit la grille et la soumet"));
  assert.ok(seq.speech[2]!.includes("Si la grille est approuvée, l'accès est autorisé"));

  // isolation
  const iso = sequences.find(s => s.id === 'isolation');
  assert.ok(iso);
  assert.ok(iso.speech[1]!.includes("NetworkPolicies : elles définissent les échanges autorisés"));
  assert.ok(iso.speech[1]!.includes("Calico : il applique ces règles et bloque les échanges non autorisés"));

  // alerte
  const alt = sequences.find(s => s.id === 'alerte');
  assert.ok(alt);
  assert.ok(alt.speech[2]!.includes("Prometheus détecte. Alertmanager notifie. Ils ne corrigent pas l'application."));

  // validation
  const val = sequences.find(s => s.id === 'validation');
  assert.ok(val);
  assert.ok(val.speech[1]!.includes("APK Android distribué par Azure Blob"));

  // retour
  const ret = sequences.find(s => s.id === 'retour');
  assert.ok(ret);
  assert.ok(ret.speech[1]!.includes("Cela répond à la problématique présentée au début. Merci pour votre attention."));
});
