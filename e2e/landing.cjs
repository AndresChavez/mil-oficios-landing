// Run with Playwright available in NODE_PATH. Uses installed Chrome; no live API writes.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');

(async () => {
  const output = path.join(__dirname, 'test-output');
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const context = await browser.newContext();
  await context.route('**/*googletagmanager*', route => route.abort());
  await context.route('**/*googleadservices*', route => route.abort());
  let requests = [], status = 200;
  await context.route('https://miloficios-preregistro-*.run.app/**', async route => {
    requests.push(route.request().postDataJSON());
    await new Promise(resolve => setTimeout(resolve, 350));
    await route.fulfill({ status, contentType: 'application/json', body: JSON.stringify({ message: status === 200 ? 'Registro exitoso' : 'Solicitud rechazada' }) });
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('dialog', dialog => dialog.accept());
  const base = process.env.BASE_URL || 'http://127.0.0.1:4200';
  const responsive = [];
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['/', '/especialistas', '/especialistas/registro', '/politicas-privacidad', '/no-existe']) {
      await page.goto(base + route);
      await page.locator('h1').waitFor();
      await page.evaluate(async () => { await document.fonts.ready; await Promise.all(Array.from(document.images, image => { image.loading = 'eager'; return image.decode().catch(() => {}); })); });
      assert.equal(await page.locator('h1').count(), 1, `${route}: one h1`);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${route}: no horizontal overflow at ${width}`);
      assert.equal(await page.locator('img').evaluateAll(images => images.some(image => image.complete && image.naturalWidth === 0)), false, `${route}: images loaded`);
      responsive.push({ width, route, overflow: false });
      if (route === '/' && [390, 1440].includes(width)) await page.screenshot({ path: path.join(output, `landing-${width}.png`), fullPage: true });
      if (route === '/especialistas/registro' && width === 390) await page.screenshot({ path: path.join(output, 'registro-paso-1.png'), fullPage: true });
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base);
  assert.equal(await page.getByText('LIMA · SERVICIOS DEL HOGAR', { exact: true }).count(), 0);
  assert.equal(await page.getByText('Ver todas', { exact: true }).count(), 0);
  assert.equal(await page.getByText('¿Listo para resolverlo?', { exact: true }).count(), 0);
  assert.equal(await page.locator('.hero .eyebrow, .hero .hero-badges').count(), 0);
  assert.ok(await page.locator('img[src*="whatsapp-black.svg"]').count() > 0);
  await page.keyboard.press('Tab');
  assert.equal(await page.locator('.skip-link').evaluate(el => document.activeElement === el && getComputedStyle(el).clipPath === 'none'), true);
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('main').evaluate(el => document.activeElement === el), true);
  const menu = page.locator('button[aria-controls=mobile-navigation]');
  await menu.click();
  assert.equal(await menu.getAttribute('aria-expanded'), 'true');
  await page.keyboard.press('Escape');
  await page.locator('button[aria-controls=mobile-navigation][aria-expanded=false]').waitFor();
  assert.equal(await menu.getAttribute('aria-expanded'), 'false');
  await menu.click();
  await page.getByRole('navigation', { name: 'Navegación móvil' }).getByRole('link', { name: 'Servicios', exact: true }).click();
  await page.waitForTimeout(450);
  assert.equal(await page.getByRole('navigation', { name: 'Navegación móvil' }).count(), 0);
  assert.ok(await page.evaluate(() => Math.abs(document.getElementById('servicios').getBoundingClientRect().top) < 50));

  async function completeForm() {
    await page.goto(base + '/especialistas/registro');
    await page.getByLabel('Nombre completo').fill('Persona de prueba');
    await page.getByLabel('Celular / WhatsApp').fill('900000000');
    await page.getByLabel('Gasfitería', { exact: true }).check();
    await page.getByLabel('Electricidad', { exact: true }).check();
    await page.getByRole('button', { name: 'Continuar', exact: true }).click();
    await page.getByLabel('Buscar distrito').fill('Miraflores');
    await page.getByLabel('Miraflores', { exact: true }).click();
    await page.getByRole('button', { name: 'Quitar Miraflores', exact: true }).waitFor();
    await page.getByLabel('Número de documento').fill('00000000');
    await page.getByLabel('Cuéntanos más de ti').fill('Experiencia de prueba');
    await page.getByRole('checkbox', { name: /Acepto el tratamiento/ }).check();
  }
  await completeForm();
  await page.getByRole('button', { name: 'Atrás', exact: true }).click();
  assert.equal(await page.getByLabel('Nombre completo').inputValue(), 'Persona de prueba');
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  assert.equal(await page.getByLabel('Número de documento').inputValue(), '00000000');
    await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({ path: path.join(output, 'registro-paso-2.png'), fullPage: true });
  const submit = page.getByRole('button', { name: 'Enviar solicitud', exact: true });
  await submit.click();
  await page.getByRole('button', { name: 'Enviando solicitud...' }).waitFor();
  assert.equal(await page.getByRole('heading', { name: '¡Recibimos tu solicitud!' }).count(), 0);
  await page.getByRole('heading', { name: '¡Recibimos tu solicitud!' }).waitFor();
  assert.equal(requests.length, 1);
  assert.equal(requests[0].specialty, 'Gasfitería, Electricidad');
  assert.equal(Object.hasOwn(requests[0], 'speciality'), false);
  assert.equal(requests[0].documentType, 'DNI');
  assert.equal(requests[0].consent, true);
  await page.screenshot({ path: path.join(output, 'registro-confirmacion.png'), fullPage: true });
  for (const errorStatus of [400, 429, 500]) {
    status = errorStatus;
    await completeForm();
    await page.getByRole('button', { name: 'Enviar solicitud', exact: true }).click();
    await page.getByRole('alert').waitFor();
    assert.equal(await page.getByRole('heading', { name: '¡Recibimos tu solicitud!' }).count(), 0);
    assert.equal(await page.getByLabel('Número de documento').inputValue(), '00000000');
    assert.equal(await page.getByRole('button', { name: 'Enviar solicitud', exact: true }).isDisabled(), errorStatus === 500);
  }
  assert.equal(await page.evaluate(() => /Persona de prueba|900000000|00000000/.test(JSON.stringify({ local: { ...localStorage }, session: { ...sessionStorage } }))), false);
  assert.deepEqual(errors, []);
  await fs.writeFile(path.join(output, 'report.json'), JSON.stringify({ responsive, form: 'passed: retained data, pending response, specialty contract, success, 400/429/500', removedElements: 'passed', runtimeErrors: errors }, null, 2));
  await browser.close();
  console.log(`Passed: ${responsive.length} responsive route checks, navigation and form contract/error scenarios. No live API writes.`);
})().catch(error => { console.error(error); process.exit(1); });




