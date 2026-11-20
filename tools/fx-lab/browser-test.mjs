import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8766/',{waitUntil:'networkidle'});
 await page.locator('[data-fx="hit"]').click();
 await page.waitForTimeout(350);
 assert.match(await page.locator('#status').textContent(),/광물 타격/);
 await page.locator('[data-fx="reward"]').click();
 await page.waitForTimeout(350);
 assert.match(await page.locator('#status').textContent(),/보상 획득/);
 await page.locator('#mute').click();
 assert.equal(await page.locator('#mute').getAttribute('aria-pressed'),'true');
 assert.deepEqual(errors,[]);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
 await page.screenshot({path:'fx-lab-mobile.png',fullPage:true});
 console.log('PASS mobile FX preview interactions and console');
}finally{await browser.close();}
