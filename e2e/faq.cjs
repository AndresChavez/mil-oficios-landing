// Uses the approved Markdown as the content contract. No live API writes or WhatsApp messages.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');

(async () => {
  const specification = await fs.readFile(path.join(__dirname, '../MIL_OFICIOS_LANDING_FAQ_IMPLEMENTACION.md'), 'utf8');
  const expected = [...specification.matchAll(/^### (FAQ-\d{2}) — (.+)\r?\n\r?\n([\s\S]*?)(?=\r?\n\r?\n(?:### FAQ-|## )|$)/gm)]
    .map(([, id, question, answer]) => ({ id: id.toLowerCase(), question: question.trim(), answer: answer.trim().replace(/\s+/g, ' ') }));
  assert.equal(expected.length, 8, 'Eight approved entries must be parsed from the specification');
  const output = path.join(__dirname, 'test-output');
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  try {
    const context = await browser.newContext();
    await context.route('**/*googletagmanager*', route => route.abort());
    await context.route('**/*googleadservices*', route => route.abort());
    let apiRequests = 0;
    await context.route('https://miloficios-preregistro-*.run.app/**', route => { apiRequests++; return route.abort(); });
    const page = await context.newPage();
    async function expectExpanded(trigger, value) {
      const id = await trigger.getAttribute('id');
      await page.locator(`#${id}[aria-expanded="${value}"]`).waitFor();
      assert.equal(await trigger.getAttribute('aria-expanded'), String(value));
    }
    const errors = [], results = [];
    page.on('pageerror', error => errors.push(error.message));
    const base = process.env.BASE_URL || 'http://127.0.0.1:4200';
    for (const width of [320, 360, 390, 768, 1023, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(base);
      const section = page.locator('#preguntas-frecuentes');
      await section.scrollIntoViewIfNeeded();
      await page.evaluate(() => document.fonts.ready);
      const triggers = section.getByRole('button');
      assert.equal(await triggers.count(), 8);
      assert.equal(await page.getByRole('heading', { level: 2, name: 'Preguntas frecuentes', exact: true }).count(), 1);
      assert.equal(await section.getByRole('region').count(), 0, 'Closed answers must be hidden from the accessibility tree');
      assert.match(await section.innerText(), /Resolvemos tus dudas para que contrates con tranquilidad\./);
      const ids = await triggers.evaluateAll(buttons => buttons.map(button => button.id));
      assert.equal(new Set(ids).size, 8);
      for (const [index, faq] of expected.entries()) {
        const trigger = triggers.nth(index);
        const panelId = await trigger.getAttribute('aria-controls');
        assert.equal(await trigger.innerText(), faq.question);
        assert.equal(await trigger.getAttribute('aria-expanded'), 'false');
        assert.equal(panelId, `${faq.id}-panel`);
        const panel = section.locator(`#${panelId}`);
        assert.equal((await panel.textContent()).trim().replace(/\s+/g, ' '), faq.answer);
        assert.equal(await panel.isHidden(), true);
        assert.equal(await panel.getAttribute('aria-labelledby'), ids[index]);
      }
      const columns = await section.locator('.faq-grid').evaluate(grid => getComputedStyle(grid).gridTemplateColumns.split(' ').length);
      assert.equal(columns, width >= 1024 ? 2 : 1);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      const cta = section.getByRole('link', { name: 'Solicitar un especialista', exact: true });
      assert.equal(await cta.count(), 1);
      assert.equal(await cta.getAttribute('href'), await page.locator('.hero .button-client').getAttribute('href'));
      assert.equal(await cta.getAttribute('target'), '_blank');
      assert.match(await cta.getAttribute('rel'), /noopener/);
      assert.equal(await section.getByRole('heading', { name: '¿Aún tienes dudas?', exact: true }).count(), 1);
      assert.match(await section.locator('.faq-close').innerText(), /Cuéntanos qué necesitas y te ayudaremos a encontrar un especialista para tu hogar\./);
      if ([390, 1440].includes(width)) await section.screenshot({ path: path.join(output, `faq-cerradas-${width}.png`) });

      const first = triggers.first(), last = triggers.last();
      await first.focus();
      assert.equal(await first.evaluate(button => document.activeElement === button && getComputedStyle(button).outlineStyle !== 'none'), true);
      await first.press('Enter');
      await expectExpanded(first, true);
      assert.equal(await section.locator('#faq-01-panel').isVisible(), true);
      assert.equal(await first.locator('app-icon').evaluate(icon => getComputedStyle(icon).rotate), '90deg');
      await first.press('Space');
      await expectExpanded(first, false);
      assert.equal(await section.locator('#faq-01-panel').isHidden(), true);
      await first.press('Space');
      await expectExpanded(first, true);
      await last.click();
      await expectExpanded(first, true);
      await expectExpanded(last, true);
      await first.click();
      await expectExpanded(first, false);
      assert.equal(await last.getAttribute('aria-expanded'), 'true', 'Closing one question must preserve other open answers');
      for (let index = 0; index < 7; index++) await triggers.nth(index).click();
      await expectExpanded(triggers.nth(6), true);
      assert.equal(await section.getByRole('region').count(), 8);
      for (const faq of expected) {
        assert.equal((await section.getByRole('region', { name: faq.question, exact: true }).innerText()).replace(/\s+/g, ' '), faq.answer);
      }
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      if ([390, 1440].includes(width)) await section.screenshot({ path: path.join(output, `faq-abiertas-${width}.png`) });
      results.push({ width, columns, content: 'exact match', keyboard: 'Enter and Space', multipleOpen: true, overflow: false });
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(base);
    const first = page.locator('#faq-01-trigger');
    await first.press('Enter');
    await expectExpanded(first, true);
    await first.press('Space');
    await expectExpanded(first, false);
    assert.equal(apiRequests, 0);
    assert.deepEqual(errors, []);
    const report = { responsive: results, reducedMotion: 'passed', cta: 'same as main CTA', apiRequests, runtimeErrors: errors };
    await fs.writeFile(path.join(output, 'faq-report.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
