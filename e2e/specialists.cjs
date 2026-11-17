// Responsive and navigation checks. All registration submissions are intercepted locally.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');

(async () => {
  const output = path.join(__dirname, 'test-output');
  await fs.mkdir(output, {recursive:true});
  const browser = await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
  try {
    const context = await browser.newContext();
    await context.route('**/*googletagmanager*', r=>r.abort());
    await context.route('**/*googleadservices*', r=>r.abort());
    const requests = [];
    await context.route('https://miloficios-preregistro-*.run.app/**', async route => {
      requests.push(route.request().postDataJSON());
      await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({message:'Registro exitoso'})});
    });
    const page = await context.newPage();
    page.on('dialog',dialog=>dialog.accept());
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    const base=process.env.BASE_URL||'http://127.0.0.1:4200';
    const responsive=[];
    for(const width of [320,360,390,640,768,1023,1024,1440]){
      await page.setViewportSize({width,height:950});
      await page.goto(base+'/especialistas');
      const cards=page.locator('.speciality-card');
      await cards.nth(4).waitFor();
      await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode();}));});
      assert.equal(await page.locator('h1').count(),1);
      assert.equal(await cards.count(),5);
      assert.equal(await page.locator('#especialidades').getByText('Lima Metropolitana',{exact:true}).count(),0);
      assert.equal(await page.getByText('Ten a mano tus datos',{exact:true}).count(),0);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'No overflow at '+width);
      const grid=await page.locator('.specialities-grid').evaluate(el=>{
        const items=[...el.children].map(x=>x.getBoundingClientRect());
        return {columns:getComputedStyle(el).gridTemplateColumns.split(' ').length,otherFull:Math.abs(items[4].width-el.getBoundingClientRect().width)<2};
      });
      assert.equal(grid.columns,width>=1024?5:width>=768?3:2);
      if(width<768){
        assert.equal(grid.otherFull,true);
        assert.ok((await cards.nth(4).boundingBox()).height < (await cards.first().boundingBox()).height);
      }
      const faq=page.locator('.faq-grid');
      assert.equal(await faq.evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),width>=1024?2:1);
      assert.equal(await faq.getByRole('button').count(),6);
      const trigger=faq.getByRole('button').first();
      await trigger.focus();await page.keyboard.press('Enter');
      await page.locator('#specialists-faq-01-trigger[aria-expanded=true]').waitFor();
      const second=faq.getByRole('button').nth(1);
      await second.focus();await page.keyboard.press('Space');
      await page.locator('#specialists-faq-02-trigger[aria-expanded=true]').waitFor();
      assert.equal(await trigger.getAttribute('aria-expanded'),'true');
      await trigger.press('Enter');await second.press('Space');
      await page.locator('#specialists-faq-02-trigger[aria-expanded=false]').waitFor();
      const menu=page.getByRole('button',{name:'Abrir menú',exact:true});
      if(width<1024){
        await menu.click();
        await page.getByRole('button',{name:'Cerrar menú',exact:true}).waitFor();
        await page.keyboard.press('Escape');
        await page.getByRole('button',{name:'Abrir menú',exact:true}).waitFor();
        assert.equal(await menu.evaluate(el=>el===document.activeElement),true);
        await menu.click();
        await page.getByRole('navigation',{name:'Navegación móvil'}).getByRole('link',{name:'Especialidades',exact:true}).click();
        await page.waitForFunction(()=>!document.querySelector('#mobile-navigation'));
      }else{
        assert.equal(await page.locator('header').getByRole('link',{name:'Comenzar registro'}).isVisible(),true);
      }
      if([390,1440].includes(width)){
        await page.evaluate(()=>{document.activeElement.blur();scrollTo(0,0);});
        await page.screenshot({path:path.join(output,'especialistas-'+width+'.png'),fullPage:true});
        await page.locator('#especialidades').screenshot({path:path.join(output,'especialidades-'+width+'.png')});
      }
      responsive.push({width,...grid,faqColumns:width>=1024?2:1});
    }
    await page.setViewportSize({width:390,height:950});
    const values=['Gasfitería','Electricidad','Línea blanca','Pintura','Otro'];
    for(const value of values){
      await page.goto(base+'/especialistas');
      const label=value==='Otro'?'Otro oficio':value;
      const card=page.getByRole('link',{name:'Comenzar registro en '+label,exact:true});
      await card.focus();
      assert.equal(await card.evaluate(el=>getComputedStyle(el).outlineStyle),'solid');
      await card.press('Enter');
      await page.getByLabel(value,{exact:true}).waitFor();
      assert.equal(new URL(page.url()).searchParams.get('speciality'),value);
      assert.equal(await page.locator('.speciality-options input:checked').count(),1);
      assert.equal(await page.getByLabel(value,{exact:true}).isChecked(),true);
    }
    await page.getByLabel('Pintura',{exact:true}).check();
    await page.getByLabel('Otro',{exact:true}).uncheck();
    await page.getByLabel('Nombre completo').fill('Persona de prueba');
    await page.getByLabel('Celular / WhatsApp').fill('900000000');
    await page.getByRole('button',{name:'Continuar',exact:true}).click();
    await page.getByLabel('Buscar distrito').fill('Miraflores');
    await page.getByLabel('Miraflores',{exact:true}).click();
    await page.getByRole('button',{name:'Quitar Miraflores',exact:true}).waitFor();
    await page.getByRole('button',{name:'Atrás',exact:true}).click();
    assert.equal(await page.getByLabel('Pintura',{exact:true}).isChecked(),true);
    assert.equal(await page.getByLabel('Otro',{exact:true}).isChecked(),false);
    assert.equal(await page.getByLabel('Nombre completo').inputValue(),'Persona de prueba');
    await page.getByRole('button',{name:'Continuar',exact:true}).click();
    await page.getByRole('button',{name:'Quitar Miraflores',exact:true}).waitFor();
    assert.equal(await page.getByLabel('Buscar distrito').inputValue(),'');
    await page.getByLabel('Número de documento').fill('00000000');
    const consent=page.getByRole('checkbox',{name:/Acepto el tratamiento/});
    assert.equal(await consent.isChecked(),false);
    await consent.check();
    await page.getByRole('button',{name:'Enviar solicitud',exact:true}).click();
    await page.getByRole('heading',{name:'¡Recibimos tu solicitud!'}).waitFor();
    assert.equal(requests.length,1);
    assert.equal(requests[0].specialty,'Pintura');
    assert.equal(Object.hasOwn(requests[0],'speciality'),false);
    for(const query of ['', '?speciality=desconocida','?speciality=','?speciality=Gasfiter%C3%ADa&speciality=Pintura','?specialty=Pintura']){
      await page.goto(base+'/especialistas/registro'+query);
      await page.getByLabel('Gasfitería',{exact:true}).waitFor();
      assert.equal(await page.locator('.speciality-options input:checked').count(),0);
    }
    // Navigating back to the home must restore its own header.
    await page.setViewportSize({width:1440,height:950});
    await page.goto(base+'/especialistas');
    await page.getByRole('link',{name:'Mil Oficios, inicio',exact:true}).first().click();
    await page.locator('header').getByRole('link',{name:'Servicios',exact:true}).waitFor({state:'attached'});
    assert.equal(await page.locator('header .header-quote').getAttribute('href').then(v=>v.startsWith('https://wa.me/')),true);
    assert.deepEqual(errors,[]);
    await fs.writeFile(path.join(output,'especialistas-report.json'),JSON.stringify({responsive,cards:'five real links with validated editable preselection',registration:'two steps retain edits, mock-only submit with specialty payload',runtimeErrors:errors,liveApiWrites:0},null,2));
    console.log('Passed: 8 responsive widths, 5 speciality entry links, keyboard, mobile menu, FAQ, edited multiselection and mock submission. No live API writes.');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});

