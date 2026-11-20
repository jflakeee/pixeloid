import {play,muted,unlockAudio} from 'plinkfx';
import {createFrame,clearFrame,createFx,composite} from '../../third_party/gamedev/pixelfx/src/core/fx.js';
import * as hit from '../../third_party/gamedev/pixelfx/src/fx/impacts/hit-spark.js';
import * as reward from '../../third_party/gamedev/pixelfx/src/fx/ui/coin-collect.js';
const canvas=document.querySelector('#stage'),ctx=canvas.getContext('2d',{alpha:false});
const frame=createFrame(canvas.width,canvas.height,canvas.width/2,canvas.height/2);
const image=ctx.createImageData(canvas.width,canvas.height);
const status=document.querySelector('#status');
let active=null,last=0;
const soundNames={hit:'hit',reward:'coin'};
document.querySelectorAll('[data-fx]').forEach(button=>button.addEventListener('click',()=>{
 const type=button.dataset.fx;
 try{
  unlockAudio();
  active=createFx(type==='hit'?hit:reward,{x:0,y:0});
  if(!muted())play(soundNames[type],{volume:.35});
  status.textContent=type==='hit'?'광물 타격 이펙트':'보상 획득 이펙트';
 }catch(e){status.textContent='효과 실행 실패: '+e.message;}
}));
document.querySelector('#mute').addEventListener('click',event=>{
 const next=muted(!muted());event.currentTarget.textContent=next?'소리 끔':'소리 켬';event.currentTarget.setAttribute('aria-pressed',String(next));
});
function frameLoop(now){
 const dt=Math.min(.05,(now-last)/1000||0);last=now;
 clearFrame(frame);
 if(active){active.update(dt);active.draw(frame);if(active.done())active=null;}
 composite(frame,image.data,0xff1f1510);
 ctx.putImageData(image,0,0);
 requestAnimationFrame(frameLoop);
}
requestAnimationFrame(frameLoop);
