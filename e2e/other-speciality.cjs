// All API responses are intercepted; these checks never write to Sheets.
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
    let status = 200;
    await context.route('https://miloficios-preregistro-*.run.app/**', async route => {
      requests.push(route.request().postDataJSON());
      await route.fulfill({ status, contentType: 'application/json', body: JSON.stringify({ message: status === 200 ? 'Registro exitoso' : 'Datos inválidos' }) });
    });
    const page = await context.newPage();
    const errors = [], responsive = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('dialog', dialog => dialog.accept());
    const base = process.env.BASE_URL || 'http://127.0.0.1:4200';
    const field = page.getByLabel('¿Qué otro oficio realizas?', { exact: false });
    const other = page.getByLabel('Otro', { exact: true });
    const next = page.getByRole('button', { name: 'Continuar', exact: true });

    async function open(query = '') {
      await page.goto(base + '/especialistas/registro' + query);
      await other.waitFor();
      await page.evaluate(() => document.fonts.ready);
    }

    for (const width of [320, 360, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await open();
      assert.equal(await field.count(), 0);
      await page.getByLabel('Nombre completo').fill('Persona de prueba');
      await page.getByLabel('Celular / WhatsApp').fill('900000000');
      await other.focus();
      await other.press('Space');
      await field.waitFor();
      assert.equal(await field.getAttribute('maxlength'), '80');
      assert.equal(await field.getAttribute('required'), '');
      assert.equal(await other.getAttribute('aria-controls'), 'other-speciality-field');
      await other.press('Tab');
      assert.equal(await field.evaluate(el => el === document.activeElement), true);
      assert.equal(await next.isDisabled(), true);
      await field.fill('   ');
      await field.press('Tab');
      await page.locator('#other-speciality-error').waitFor();
      assert.equal(await field.getAttribute('aria-invalid'), 'true');
      assert.equal(await next.isDisabled(), true);
      await field.fill('Carpintería');
      assert.equal(await next.isEnabled(), true);
      await page.getByLabel('Pintura', { exact: true }).check();
      await other.uncheck();
      await field.waitFor({ state: 'detached' });
      assert.equal(await field.count(), 0);
      assert.equal(await next.isEnabled(), true);
      await other.check();
      await field.waitFor();
      assert.equal(await field.inputValue(), 'Carpintería');
      await next.click();
      await page.getByRole('heading', { name: 'Zona y verificación', exact: true }).waitFor();
      await page.getByRole('button', { name: 'Atrás', exact: true }).click();
      await field.waitFor();
      assert.equal(await field.inputValue(), 'Carpintería');
      assert.equal(await page.getByLabel('Pintura', { exact: true }).isChecked(), true);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      if ([390, 1440].includes(width)) {
        await page.evaluate(() => { document.activeElement.blur(); scrollTo(0, 0); });
        await page.screenshot({ path: path.join(output, `registro-otro-${width}.png`), fullPage: true });
      }
      responsive.push({ width, conditionalField: true, keyboard: true, retained: true });
    }

    await open('?speciality=Otro');
    await field.waitFor();
    assert.equal(await field.inputValue(), '');
    assert.equal(await next.isDisabled(), true);
    await page.getByLabel('Nombre completo').fill('Persona de prueba');
    await page.getByLabel('Celular / WhatsApp').fill('900000000');
    await page.getByLabel('Pintura', { exact: true }).check();
    await field.fill('  Carpintería  ');
    await next.click();
    await page.getByLabel('Buscar distrito').fill('Miraflores');
    await page.getByLabel('Miraflores', { exact: true }).click();
    await page.getByRole('button', { name: 'Quitar Miraflores', exact: true }).waitFor();
    await page.getByLabel('Número de documento').fill('00000000');
    await page.getByLabel('Cuéntanos más de ti').fill('Experiencia de prueba');
    await page.getByRole('checkbox', { name: /Acepto el tratamiento/ }).check();
    status = 422;
    await page.getByRole('button', { name: 'Enviar solicitud', exact: true }).click();
    await page.locator('#registration-error').waitFor();
    await page.getByRole('button', { name: 'Atrás', exact: true }).click();
    assert.equal(await field.inputValue(), '  Carpintería  ');
    await field.fill('');
    await page.waitForFunction(() => document.querySelector('.form-actions button[type="submit"]').disabled);
    assert.equal(await next.isDisabled(), true);
    await field.fill('Carpintería');
    await next.click();
    status = 200;
    await page.getByRole('button', { name: 'Enviar solicitud', exact: true }).click();
    await page.getByRole('heading', { name: '¡Recibimos tu solicitud!', exact: true }).waitFor();
    assert.equal(requests.length, 2);
    for (const request of requests) {
      assert.equal(request.specialty, 'Otro: Carpintería, Pintura');
      assert.equal(request.description, 'Experiencia de prueba');
      assert.equal(Object.hasOwn(request, 'otherSpeciality'), false);
      assert.equal(Object.hasOwn(request, 'speciality'), false);
    }
    assert.equal(await page.evaluate(() => /Carpintería|Persona de prueba|900000000/.test(JSON.stringify({ local: { ...localStorage }, session: { ...sessionStorage } }))), false);
    assert.deepEqual(errors, []);
    await fs.writeFile(path.join(output, 'registro-otro-report.json'), JSON.stringify({ responsive, preselection: 'passed', errorsAndSubmission: '422 retains value; successful mock request uses specialty', runtimeErrors: errors, liveApiWrites: 0 }, null, 2));
    console.log('Passed: conditional trade field at 6 widths, validation, keyboard, retained input, preselection and mock 422/success submissions. No live API writes.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exit(1); });
