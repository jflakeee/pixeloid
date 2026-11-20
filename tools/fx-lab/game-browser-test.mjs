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
 // Exercise the exact bundled runtime, including 300 frames of repeated hits.
 const perf=await page.evaluate(async()=>{
  const fx=await import('./fx-runtime.mjs');
  const canvas=document.createElement('canvas');
  canvas.width=390;canvas.height=640;
  const ctx=canvas.getContext('2d');
  const start=performance.now();
  for(let i=0;i<300;i++){
   if(i%5===0)fx.trigger(i%15===0?'reward':'hit',i/60,false);
   fx.drawFx(ctx,390,640,1/60);
  }
  fx.trigger('win',10,false);
  for(let i=0;i<45;i++)fx.drawFx(ctx,390,640,1/60);
  return {elapsedMs:performance.now()-start,pixels:ctx.getImageData(180,300,1,1).data.length};
 });
 assert.equal(perf.pixels,4);
 assert.ok(perf.elapsedMs<10000,'effect animation must not stall mobile browser');
 assert.deepEqual(errors,[],'no JS errors after repeated FX draws');
 await page.screenshot({path:'game-fx-mobile.png',fullPage:true});
 console.log('PASS Pixeloid mobile FX 345 frames; elapsedMs='+perf.elapsedMs.toFixed(1));
}finally{await browser.close();}
