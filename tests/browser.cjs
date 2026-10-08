const assert = require('node:assert/strict');
const { chromium } = require('playwright');
(async () => {
 const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH ? {executablePath:process.env.CHROMIUM_PATH} : {}),args:['--no-sandbox']});
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const base=process.env.TEST_URL||'http://127.0.0.1:5173/-1/';
 async function visit(path='/'){await page.goto(base+'#'+path);await page.waitForTimeout(150)}
 try {
  await page.setViewportSize({width:1280,height:900});await visit();await page.getByRole('heading',{name:'اكتشف السعودية من أهلها',exact:true}).waitFor();
  await page.locator('.experience-track img').last().scrollIntoViewIfNeeded();
  await page.getByRole('button',{name:'التجارب التالية'}).click();await page.waitForTimeout(500);assert(await page.locator('.experience-track').evaluate(e=>e.scrollLeft<0));
  await visit('/experiences');assert.equal(await page.locator('.catalog-card').count(),6);
  await page.getByRole('combobox',{name:'المنطقة',exact:true}).selectOption('الطائف');assert.equal(await page.locator('.catalog-card').count(),1);
  await page.getByRole('combobox',{name:'المدة',exact:true}).selectOption('4');assert.equal(await page.locator('.catalog-card').count(),0);
  await page.getByRole('button',{name:'مسح الفلاتر'}).click();await page.getByRole('searchbox',{name:'ابحث عن تجربة'}).fill('الزيتون');assert.equal(await page.locator('.catalog-card').count(),1);
  await visit('/regions');await page.locator('.region-card').filter({hasText:'الأحساء'}).click();await page.waitForTimeout(150);assert.equal(await page.locator('.catalog-card').count(),1);
  await page.locator('.catalog-card').click();await page.getByRole('heading',{name:'يوم بين النخيل',exact:true}).first().waitFor();
  await page.getByRole('button',{name:'عرض صورة 2',exact:true}).click();assert((await page.locator('.detail-hero').getAttribute('style')).includes('palms.jpg'));
  await page.getByRole('link',{name:'احجز تجربتك',exact:true}).click();
  await page.getByRole('button',{name:'متابعة إلى الدفع'}).click();assert(page.url().includes('/booking/'));assert(await page.locator('input:invalid,select:invalid').count()>0);
  const d=new Date();d.setDate(d.getDate()+2);const date=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  await page.getByLabel('التاريخ',{exact:true}).fill(date);await page.getByRole('combobox',{name:'الوقت',exact:true}).selectOption('09:00');await page.getByLabel('عدد الأشخاص').fill('2');await page.getByLabel('الاسم الكامل').fill('زائر تجريبي');await page.getByLabel('رقم الجوال').fill('0500000000');await page.getByLabel('البريد الإلكتروني',{exact:true}).fill('visitor@example.com');
  await page.getByRole('button',{name:'قراءة شروط الحجز والإلغاء'}).click();assert(await page.locator('dialog').isVisible());await page.keyboard.press('Escape');assert(!(await page.locator('dialog').isVisible()));
  await page.getByLabel('اطّلعت على شروط الحجز وطبيعة العملية الاستعراضية').check();await page.getByRole('button',{name:'متابعة إلى الدفع'}).click();await page.getByRole('heading',{name:'طريقة الدفع',exact:true}).waitFor();
  assert((await page.locator('.total').textContent()).includes('٣٠٠'));assert.equal(await page.locator('input').count(),3);assert((await page.locator('.form-panel .notice').textContent()).includes('لا ينتج عنها حجز فعلي أو خصم مالي'));
  await page.reload();await page.getByRole('heading',{name:'طريقة الدفع',exact:true}).waitFor();
  await page.getByLabel('مدى', {exact:false}).check();await page.getByRole('button',{name:'تأكيد الطلب الاستعراضي',exact:true}).click();await page.getByRole('heading',{name:'اكتمل استعراض خطوات الحجز',exact:true}).waitFor();assert((await page.locator('.reference').textContent()).includes('MH-DEMO-'));assert(await page.getByText('لم يتم إنشاء حجز فعلي أو خصم أي مبلغ. هذه نتيجة استعراضية فقط.',{exact:true}).isVisible());
  await page.reload();await page.getByRole('heading',{name:'اكتمل استعراض خطوات الحجز',exact:true}).waitFor();await page.getByRole('button',{name:'مسح بيانات الطلب'}).click();await visit('/payment');await page.getByRole('heading',{name:'اختر تجربتك أولًا'}).waitFor();
  await visit('/contact?owner=1');await page.getByLabel('الاسم',{exact:true}).fill('مالك تجريبي');await page.getByLabel('البريد الإلكتروني',{exact:true}).fill('owner@example.com');await page.getByLabel('اسم المزرعة').fill('مزرعة تجريبية');await page.getByRole('combobox',{name:'المنطقة',exact:true}).selectOption('الرياض');await page.getByLabel('رسالتك').fill('هذه رسالة تجريبية لاختبار نموذج أصحاب المزارع.');await page.getByRole('button',{name:'إرسال طلب الانضمام'}).click();await page.getByRole('status').waitFor();assert((await page.getByRole('status').textContent()).includes('لم تُرسل'));
  for(const width of [390,1280]) {
   await page.setViewportSize({width,height:900});
   for(const route of ['/','/experiences','/regions','/experience/palms','/booking/palms','/contact','/missing']){
    await visit(route);assert(!(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)),`overflow at ${width} ${route}`);
    assert(await page.locator('main h1').count()>0);
    await page.evaluate(()=>Promise.all([...document.images].map(i=>i.complete?Promise.resolve():new Promise(r=>{i.onload=r;i.onerror=r}))));
    assert(await page.evaluate(()=>[...document.images].every(i=>i.naturalWidth>0)),`broken image ${route}`);
   }
  }
  assert.deepEqual(errors,[]);console.log('PASS: homepage, carousel, combined filters, regions, gallery, form validation, terms keyboard dismissal, booking totals, simulated payment, reload persistence, deletion, contact form, 14 responsive routes, all images and JavaScript errors.');
 } finally {await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
