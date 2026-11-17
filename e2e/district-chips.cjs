// No live API writes: every registration response is fulfilled locally.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');

(async () => {
  const output = path.join(__dirname, 'test-output');
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  try {
    const context = await browser.newContext();
    await context.route('**/*googletagmanager*', r => r.abort());
    await context.route('**/*googleadservices*', r => r.abort());
    const requests = [];
    await context.route('https://miloficios-preregistro-*.run.app/**', async route => {
      requests.push(route.request().postDataJSON());
      await new Promise(resolve => setTimeout(resolve, 400));
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ message: 'Registro exitoso' }) });
    });
    const page = await context.newPage();
    const errors = [], responsive = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('dialog', dialog => dialog.accept());
    const base = process.env.BASE_URL || 'http://127.0.0.1:4200';
    const search = page.getByLabel('Buscar distrito', { exact: true });
    const selected = page.getByRole('group', { name: 'Distritos seleccionados', exact: true });
    const results = page.getByRole('group', { name: 'Distritos disponibles', exact: true });

    async function expectSearchReset() {
      await page.waitForFunction(() => document.querySelector('#district-search')?.value === '' &&
        document.querySelectorAll('.district-option').length === 0 && document.activeElement?.id === 'district-search');
      assert.equal(await search.inputValue(), '');
      assert.equal(await results.getByRole('checkbox').count(), 0);
    }

    for (const width of [320, 360, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(base + '/especialistas/registro');
      await page.getByLabel('Nombre completo').fill('Persona de prueba');
      await page.getByLabel('Celular / WhatsApp').fill('900000000');
      await page.getByLabel('Gasfitería', { exact: true }).check();
      await page.getByRole('button', { name: 'Continuar', exact: true }).click();
      await search.waitFor();
      assert.equal(await results.getByRole('checkbox').count(), 0);
      await search.fill('sur');
      await page.getByLabel('Surquillo', { exact: true }).waitFor();
      assert.equal(await results.getByRole('checkbox').count(), 2);
      await search.fill('surc');
      await page.waitForFunction(() => document.querySelectorAll('.district-option').length === 1);
      const surco = page.getByLabel('Santiago de Surco', { exact: true });
      await surco.focus();
      await surco.press('Space');
      await expectSearchReset();
      await selected.getByRole('button', { name: 'Quitar Santiago de Surco', exact: true }).waitFor();
      await search.fill('JESUS');
      await page.getByLabel('Jesús María', { exact: true }).click();
      await expectSearchReset();
      await search.fill('mira');
      await page.getByLabel('Miraflores', { exact: true }).click();
      await expectSearchReset();
      await selected.getByRole('button', { name: 'Quitar Miraflores', exact: true }).waitFor();
      assert.equal(await selected.getByRole('button').count(), 3);
      await search.fill('');
      await page.waitForFunction(() => document.querySelectorAll('.district-option').length === 0);
      assert.equal(await selected.getByRole('button').count(), 3);
      const remove = selected.getByRole('button', { name: 'Quitar Jesús María', exact: true });
      await remove.focus();
      await remove.press('Enter');
      await page.waitForFunction(() => document.activeElement?.id === 'district-search');
      assert.equal(await selected.getByRole('button').count(), 2);
      await selected.getByRole('button', { name: 'Quitar Santiago de Surco', exact: true }).click();
      await page.waitForFunction(() => document.querySelectorAll('[aria-label="Distritos seleccionados"] button').length === 1);
      await search.fill('no-existe');
      await results.getByText('No encontramos ese distrito. Prueba con otro nombre.', { exact: true }).waitFor();
      assert.equal(await selected.getByRole('button').count(), 1);
      await page.getByRole('button', { name: 'Atrás', exact: true }).click();
      await page.getByRole('button', { name: 'Continuar', exact: true }).click();
      await selected.getByRole('button', { name: 'Quitar Miraflores', exact: true }).waitFor();
      assert.equal(await search.inputValue(), 'no-existe');
      await search.fill('sur');
      await page.getByLabel('Santiago de Surco', { exact: true }).click();
      await expectSearchReset();
      await selected.getByRole('button', { name: 'Quitar Santiago de Surco', exact: true }).waitFor();
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      assert.equal(await results.evaluate(el => getComputedStyle(el).display), 'flex');
      if ([390, 1440].includes(width)) {
        await page.evaluate(() => document.activeElement.blur());
        await page.locator('fieldset:has(#district-search)').screenshot({ path: path.join(output, `distritos-chips-${width}.png`) });
      }
      responsive.push({ width, liveMatches: true, resetAfterSelection: true, keyboard: true, retainedSelection: true, overflow: false });
    }

    await page.getByLabel('Número de documento').fill('00000000');
    await page.getByRole('checkbox', { name: /Acepto el tratamiento/ }).check();
    await page.getByRole('button', { name: 'Enviar solicitud', exact: true }).click();
    await page.getByRole('button', { name: 'Enviando solicitud...', exact: true }).waitFor();
    assert.equal(await search.isDisabled(), true);
    assert.equal(await selected.getByRole('button').first().isDisabled(), true);
    await page.getByRole('heading', { name: '¡Recibimos tu solicitud!', exact: true }).waitFor();
    assert.equal(requests.length, 1);
    assert.equal(requests[0].district, 'Miraflores, Santiago de Surco');
    assert.equal(requests[0].specialty, 'Gasfitería');
    assert.deepEqual(errors, []);
    await fs.writeFile(path.join(output, 'distritos-chips-report.json'), JSON.stringify({ responsive, payload: 'selected districts only, district string preserved', runtimeErrors: errors, liveApiWrites: 0 }, null, 2));
    console.log('Passed: 6 widths, substring/accent filtering, chips, keyboard removal, retained selection and mock-only submission.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exit(1); });
