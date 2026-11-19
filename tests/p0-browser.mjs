import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {fresh,encode,KEY} from '../dist/core.mjs';
const browser=await chromium.launch({headless:true});
try {
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const a=await context.newPage(),b=await context.newPage();
 const url='http://127.0.0.1:8765/';
 await a.goto(url);
 await a.waitForFunction(()=>document.querySelector('#saveState').textContent.includes('저장 가능'));
 await b.goto(url);
 await b.waitForFunction(()=>document.querySelector('#saveState').textContent.includes('다른 탭'));
 const s=fresh();s.money=125;
 await b.evaluate(([key,value])=>localStorage.setItem(key,value),[KEY,encode(s)]);
 await a.waitForFunction(()=>document.querySelector('#saveState').textContent.includes('저장 중지'));
 await a.close();
 await b.reload();
 await b.waitForFunction(()=>document.querySelector('#saveState').textContent.includes('저장 가능'));
 assert.equal(await b.evaluate(key=>JSON.parse(localStorage.getItem(key)).money,KEY),125);
 await b.screenshot({path:'p0-mobile.png'});
 console.log('PASS Chromium lock contention, external write freeze, reload recovery');
}finally{await browser.close();}
