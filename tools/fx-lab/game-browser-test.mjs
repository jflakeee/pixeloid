import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const browser=await chromium.launch();
try{
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const errors=[],requests=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(r.url().includes('fx-runtime.mjs'))requests.push(r.status());});
 await page.goto('http://127.0.0.1:8767/',{waitUntil:'networkidle'});
 assert.deepEqual(requests,[200],'compiled optional FX runtime must load');
 await page.waitForTimeout(200);
 assert.deepEqual(errors,[],'no JS errors during startup');
 await page.screenshot({path:'game-fx-mobile.png',fullPage:true});
 console.log('PASS Pixeloid mobile runtime load with bundled FX');
}finally{await browser.close();}
