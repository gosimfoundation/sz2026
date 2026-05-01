import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('landing page presents the GOSIM Shenzhen 2026 conference', async () => {
  const html = await read('index.html');
  const css = await read('styles.css');

  assert.match(html, /<h1[^>]*>[\s\S]*GOSIM[\s\S]*Shenzhen[\s\S]*2026[\s\S]*<\/h1>/i);
  assert.match(html, /<span class="hero__city-word">Shenzhen<\/span>/);
  assert.match(css, /--city-accent:\s*#b8ff5c;/);
  assert.match(css, /\.hero__city-word\s*{[^}]*color:\s*var\(--city-accent\)/s);
  assert.match(html, /October\s+2026/i);
  assert.match(html, /Shenzhen,\s*China/i);
  assert.match(html, /Open-source AI, robotics, edge systems, and developer infrastructure/i);
  assert.doesNotMatch(html, /href="#program"/);
  assert.match(html, /href="#updates"/);
});

test('teaser page keeps only concise navigable sections and update form', async () => {
  const html = await read('index.html');

  for (const id of ['updates']) {
    assert.match(html, new RegExp(`id="${id}"`));
  }

  assert.doesNotMatch(html, /href="#city"/);
  assert.doesNotMatch(html, /id="program"/);
  assert.doesNotMatch(html, />Program</);
  assert.match(html, /type="email"/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /name="interest"/);
});

test('Shenzhen section is preserved but hidden for future use', async () => {
  const html = await read('index.html');
  const css = await read('styles.css');

  assert.match(html, /Future Shenzhen section/);
  assert.match(html, /<section class="city-section section-image" id="city"[^>]*hidden/);
  assert.match(html, /aria-hidden="true"/);
  assert.match(css, /\[hidden\]\s*{[^}]*display:\s*none\s*!important;/s);
  assert.match(html, /China's hardware hub/i);
  assert.match(html, /Huaqiangbei/i);
  assert.match(html, /factory floors/i);
  assert.match(html, /supply chains/i);
});

test('what to expect intro band is removed', async () => {
  const html = await read('index.html');
  const css = await read('styles.css');

  assert.doesNotMatch(html, /intro-section/);
  assert.doesNotMatch(html, />What To Expect</);
  assert.doesNotMatch(html, /Open software meets physical systems/i);
  assert.doesNotMatch(html, /Open source, closer to real hardware/i);
  assert.doesNotMatch(html, /Conference Thesis/i);
  assert.doesNotMatch(html, /A working room for the open stack/i);
  assert.doesNotMatch(css, /\.intro-section/);
});

test('teaser avoids a specific date and countdown timer', async () => {
  const html = await read('index.html');
  const css = await read('styles.css');
  const js = await read('script.js');

  assert.match(html, /October\s+2026/i);
  assert.doesNotMatch(html, /October\s+15/i);
  assert.doesNotMatch(html, /2026-10-15/i);
  assert.doesNotMatch(html, /countdown/i);
  assert.doesNotMatch(css, /\.countdown/);
  assert.doesNotMatch(css, /countTick/);
  assert.doesNotMatch(js, /COUNTDOWN_TARGET/);
  assert.doesNotMatch(js, /updateCountdown/);
  assert.doesNotMatch(js, /setInterval\(updateCountdown/);
});

test('hero highlights surface track keywords drawn from the GOSIM Paris 2026 program', async () => {
  const html = await read('index.html');

  assert.match(html, /Agentic AI/i);
  assert.match(html, /MCP/i);
  assert.match(html, /A2A/i);
  assert.match(html, /edge AI/i);
  assert.match(html, /Open Source Robotics/i);
  assert.match(html, /Embodied AI/i);
  assert.match(html, /OpenArm/i);
  assert.match(html, /Open Source Models/i);
  assert.match(html, /vision/i);
  assert.match(html, /Spotlight\s*(?:&amp;|&)\s*Hackathons/i);
  assert.match(html, /Frontier Creators/i);
});

test('visual system includes a real Shenzhen image, responsive layout, and motion safeguards', async () => {
  const html = await read('index.html');
  const css = await read('styles.css');
  const js = await read('script.js');

  assert.match(html, /Shenzhen_Skyline_At_Night/i);
  assert.match(html, /Andreas Bunen/i);
  assert.match(css, /\.hero::before/);
  assert.match(css, /@media\s*\(max-width:\s*720px\)[\s\S]*\.hero__lower\s*{[\s\S]*position:\s*static;/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /@media\s*\(max-width:\s*720px\)/);
  assert.match(js, /IntersectionObserver/);
  assert.match(js, /requestAnimationFrame/);
});

test('landing page declares a local favicon for clean browser loading', async () => {
  const html = await read('index.html');
  const icon = await read('assets/favicon.svg');

  assert.match(html, /rel="icon"/);
  assert.match(html, /href="assets\/favicon\.svg"/);
  assert.match(icon, /GOSIM/);
});
