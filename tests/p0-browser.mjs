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
 assert.equal(await b.locator('#play').isDisabled(),true);
 assert.equal(await b.locator('[data-type="1"]').isDisabled(),true);
 await a.locator('[data-type="1"]').tap();
 assert.equal(await a.locator('[data-type="1"]').getAttribute('aria-pressed'),'true');
 assert.equal(await a.evaluate(key=>JSON.parse(localStorage.getItem(key)).selected,KEY),1);
 const s=fresh();s.money=125;s.selected=2;
 await b.evaluate(([key,value])=>localStorage.setItem(key,value),[KEY,encode(s)]);
 await a.waitForFunction(()=>document.querySelector('#saveState').textContent.includes('저장 중지'));
 await a.waitForFunction(()=>document.querySelector('#play').disabled);
 await a.close();
 await b.reload();
 await b.waitForFunction(()=>document.querySelector('#saveState').textContent.includes('저장 가능'));
 assert.equal(await b.evaluate(key=>JSON.parse(localStorage.getItem(key)).money,KEY),125);
 await b.waitForFunction(()=>document.querySelector('[data-type="2"]').getAttribute('aria-pressed')==='true');
 for(const viewport of [{width:390,height:844},{width:844,height:390},{width:320,height:568}]){
  await b.setViewportSize(viewport);
  await b.waitForFunction(()=>{const r=document.querySelector('#game').getBoundingClientRect();return r.width>0&&r.height>0;});
  const bounds=await b.locator('#saveState').boundingBox();
  assert(bounds&&bounds.x>=0&&bounds.y>=0&&bounds.x+bounds.width<=viewport.width+1);
  assert.equal(await b.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
 }
 await b.setViewportSize({width:390,height:844});
 await b.screenshot({path:'p0-mobile.png'});
 console.log('PASS Chromium lock contention, external write freeze, reload recovery');
}finally{await browser.close();}
