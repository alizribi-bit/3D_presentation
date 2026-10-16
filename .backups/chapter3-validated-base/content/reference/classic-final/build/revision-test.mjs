// @ts-check
// v9 contract tests: source/runtime agreement, exact reading cues, navigation and presenter sync.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const require = createRequire(process.env.HOME + '/.claude/skills/deck-kit/export/package.json');
const { chromium } = require('playwright-core');
const directory = resolve(process.argv[2] || '.');
const deckURL = pathToFileURL(resolve(directory, 'deck.offline.html')).href;
const rows = readFileSync(resolve(directory, 'SCRIPT.md'), 'utf8').split('\n')
  .filter(line => /^\| \d+ \|/.test(line)).map(line => line.split('|').slice(1, -1).map(cell => cell.trim()));
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
/** @type {string[]} */
const errors = [];
/** @type {string[]} */
const network = [];
let checks = 0;
/** @param {string} name @param {boolean} condition */
function check(name, condition) {
  assert.ok(condition, name);
  checks++;
  console.log('PASS ' + name);
}
await context.route('**/*', route => {
  const url = route.request().url();
  if (/^(file:|data:)/.test(url)) return route.continue();
  network.push(url);
  return route.abort();
});

try {
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(String(error)));
  await page.goto(deckURL);
  await page.waitForFunction(() => document.documentElement.classList.contains('dk-ready'));
  const model = await page.evaluate(() => window.__deck.slides);
  check('44 runtime slides agree with speech rows', model.length === 44 && rows.length === 44);
  const expectedClicks = rows.reduce((n, row) => n + Number(row[3]), 0);
  const expectedStates = model.length + expectedClicks;
  check(`${expectedClicks} reveal clicks and ${expectedStates} states agree with speech`, model.reduce((n, slide) => n + slide.steps, 0) === expectedClicks);
  check('one unique slide id per row', new Set(model.map(slide => slide.id)).size === 44);
  check('BMC → problem → needs → methodology → chapter 2', model.slice(6, 11).map(slide => slide.id).join(',') === 'modele,problematique,besoins,methodologie,ch2');
  check('perspectives → film → conclusion', model.slice(-3).map(slide => slide.id).join(',') === 'limites,video,retour');
  check('every runtime click agrees with the script', model.every((slide, i) => slide.steps === Number(rows[i][3])));
  const notes = await page.evaluate(() => [...document.querySelectorAll('section.slide')].map(slide => [...slide.querySelectorAll('aside.notes p')].map(p => p.textContent.trim())));
  /** @param {string} text */
  const normalise = text => text.replaceAll('[lire]', 'À lire:').replace(/À lire\s*:/g, 'À lire:').replace(/\s+/g, ' ').trim();
  check('all integrated note segments match source speech', rows.every((row, i) => row[7].split(' [clic] ').every((part, step) => normalise(part) === normalise(notes[i][step])) && notes[i].length === Number(row[3]) + 1));
  const bilanIndex = model.findIndex(slide => slide.id === 'bilan');
  const bilanRow = rows[bilanIndex];
  const exactBilanLine = 'Les essais en staging et en production montrent comment ces deux volets fonctionnent ensemble.';
  check('bilan contains only its two main outcome cards and the requested closing line',
    bilanIndex >= 0 && (await page.locator('#bilan .ct').count()) === 2 &&
    !(await page.locator('#bilan').textContent()).includes('Staging validé sur le périmètre présenté') &&
    !(await page.locator('#bilan').textContent()).includes('Production déployée ; parcours fournisseur/acheteur') &&
    !(await page.locator('#bilan').textContent()).includes('Développement de la plateforme et mise en place DevSecOps'));
  check('bilan closing line appears as a read cue only in the final note',
    bilanRow[7].split(' [clic] ').length === 3 &&
    bilanRow[7].split(' [clic] ')[2].endsWith(`[lire] « ${exactBilanLine} »`) &&
    !bilanRow[7].split(' [clic] ')[2].split('[lire]')[0].includes(exactBilanLine));
  /** @param {string} selector */
  const isShown = selector => page.locator(selector).evaluate(element => Number(getComputedStyle(element).opacity) > .95);
  for (const step of [0, 1, 2]) {
    await page.evaluate(hash => { location.hash = hash; }, `#${bilanIndex + 1}${step ? '.' + step : ''}`);
    await page.waitForTimeout(1600);
    check(`bilan step ${step}: both primary cards remain`, await page.locator('#bilan .ct').count() === 2);
    check(`bilan step ${step}: closing line only visible at the final click`, await isShown('#bilan .close') === (step === 2));
    check(`bilan step ${step}: presenter note matches the corresponding source state`,
      normalise((await page.locator(`#bilan aside.notes p`).allTextContents())[step]) === normalise(bilanRow[7].split(' [clic] ')[step]));
  }
  await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(350);
  check('bilan backwards returns to step 1 and hides the closing line',
    await page.evaluate(() => location.hash) === `#${bilanIndex + 1}.1` && !(await isShown('#bilan .close')));
  await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(350);
  check('bilan backwards returns to step 0 and restores the synchronized note',
    await page.evaluate(() => location.hash) === `#${bilanIndex + 1}` &&
    normalise((await page.locator('#bilan aside.notes p').first().textContent()) || '') === normalise(bilanRow[7].split(' [clic] ')[0]));
  check('no provenance dates remain in slide text or accessible image labels', await page.evaluate(() =>
    [...document.querySelectorAll('section.slide')].every(slide =>
      !/\b0[367]\/10\b/.test(slide.innerText + ' ' + [...slide.querySelectorAll('img')].map(img => img.alt).join(' ')))));
  const readings = [...rows[7][7].matchAll(/\[lire\] « (.*?) »/g)].map(match => match[1]);
  const screen = await page.locator('#problematique').textContent();
  check('the general question matches projected text exactly', readings.length === 1 && readings.every(text => screen.includes(text)));
  check('six-part outline has the requested conclusion title', await page.locator('#sommaire .list li').count() === 6 && (await page.locator('#sommaire .list li:last-child').textContent()).includes('Bilan, perspectives et conclusion'));
  check('no DNS or 10/11 in public slides or speech', await page.evaluate(() => [...document.querySelectorAll('section.slide')].every(slide => !/\bDNS\b|10\s*\/\s*11/i.test(slide.textContent))));
  check('chapter transitions use a light dip', await page.evaluate(() => [...document.querySelectorAll('[data-transition="dip"]')].every(slide => slide.getAttribute('data-color') === '#f4f7f2')));
  check('all former night slides have white backgrounds', await page.evaluate(() => [...document.querySelectorAll('.slide.night')].every(slide => getComputedStyle(slide).backgroundColor === 'rgb(255, 255, 255)' && getComputedStyle(slide).backgroundImage === 'none')));
  check('green logo on the conclusion', (await page.locator('#retour .logo').getAttribute('src')).startsWith('data:image/'));
  check('methodology contains exactly S1–S5 and three releases', await page.locator('#methodologie .release').count() === 3 && !/S6|Release 4|Sprint 6/.test(await page.locator('#methodologie').textContent()));
  check('sprint markers cover containerisation, Azure, CI, GitOps and exploitation', await page.locator('.sprint-marker').count() === 7);

  /** @param {number} slide @param {number} step */
  const jump = async (slide, step) => {
    await page.evaluate(hash => { location.hash = hash; }, `#${slide}.${step}`);
    await page.waitForTimeout(1600);
  };
  /** @param {string} selector */
  const visible = selector => page.locator(selector).evaluate(element => Number(getComputedStyle(element).opacity) > .95);
  for (let step = 0; step <= 1; step++) {
    await jump(8, step);
    check(`problem step ${step}: exact reveal state`, (await visible('#problematique .panel:nth-of-type(1)')) === (step === 0) && (await visible('#problematique .panel:nth-of-type(2)')) === (step === 1));
  }
  await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(350);
  check('back from question restores all four issues', await visible('#problematique .panel:nth-of-type(1)'));
  for (const slide of [9, 10]) {
    for (let step = 0; step <= 1; step++) {
      await jump(slide, step);
      const id = model[slide - 1].id;
      check(`${id} step ${step}: one content family at a time`, (await visible(`#${id} .panel:nth-of-type(1)`)) === (step === 0) && (await visible(`#${id} .panel:nth-of-type(2)`)) === (step === 1));
    }
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(350);
    check(`${model[slide - 1].id}: backwards restores entry state`, await visible(`#${model[slide - 1].id} .panel:nth-of-type(1)`));
  }
  await jump(8, 0);
  await page.mouse.click(1500, 900);
  await page.waitForTimeout(750);
  check('mouse advances to the question once', await page.evaluate(() => location.hash === '#8.1'));
  await page.keyboard.press(' ');
  await page.waitForTimeout(800);
  check('Space then enters needs once', await page.evaluate(() => location.hash === '#9'));

  await jump(8, 0);
  const [presenter] = await Promise.all([page.waitForEvent('popup'), page.keyboard.press('p')]);
  await presenter.waitForLoadState();
  await presenter.waitForSelector('.dk-pv-now .dk-pv-seg.on');
  for (const [slide, step, expected] of [[8, 0, 'Le projet doit proposer'], [8, 1, 'Comment concevoir'], [9, 0, 'On précise ensuite'], [9, 1, 'On précise aussi'], [10, 0, 'On organise le travail'], [10, 1, 'trois releases et cinq sprints']]) {
    await jump(slide, step);
    await presenter.waitForTimeout(300);
    check(`presenter follows new sequence ${slide}.${step}`, (await presenter.locator('.dk-pv-now .dk-pv-seg.on').textContent()).includes(expected));
  }
  await presenter.keyboard.press('ArrowLeft');
  await page.waitForTimeout(500);
  check('presenter backwards restores methodology cycle in audience window', await page.evaluate(() => location.hash === '#10'));
  await presenter.close();

  const hashes = model.flatMap((slide, i) => Array.from({ length: slide.steps + 1 }, (_, step) => `#${i + 1}${step ? '.' + step : ''}`));
  await jump(1, 0);
  let forward = true;
  for (const expected of hashes.slice(1)) {
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(35);
    if (await page.evaluate(() => location.hash) !== expected) forward = false;
  }
  check(`all ${expectedStates - 1} advances follow the ${expectedStates} states in order`, forward);
  let backward = true;
  for (const expected of hashes.slice(0, -1).reverse()) {
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(35);
    if (await page.evaluate(() => location.hash) !== expected) backward = false;
  }
  check(`all ${expectedStates - 1} backwards presses restore the states in reverse order`, backward);
  for (const slide of [3, 11, 16, 24, 34, 40]) {
    await page.keyboard.type(String(slide));
    await page.keyboard.press('Enter');
    await page.waitForTimeout(100);
    check(`chapter shortcut ${slide} + Enter`, await page.evaluate(() => location.hash) === `#${slide}`);
  }

  const speech = await context.newPage();
  await speech.goto(pathToFileURL(resolve(directory, 'discours.html')).href);
  check('speech viewer shows 44 slides', (await speech.locator('.count').textContent()).includes('/ 44'));
  await speech.keyboard.type('44');
  await speech.keyboard.press('Enter');
  await speech.keyboard.press('ArrowRight');
  check('speech viewer reaches the exact closing speech', (await speech.locator('#steps').textContent()).includes('Cela répond à la problématique présentée au début.'));
  check('no external requests offline', network.length === 0);
  check('no browser exceptions', errors.length === 0);
  console.log(`${checks}/${checks} PASS`);
} finally {
  await browser.close();
}
