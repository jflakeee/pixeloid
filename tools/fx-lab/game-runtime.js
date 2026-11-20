// Optional browser-only effects. Failure never changes gameplay or save state.
import {play,unlockAudio} from 'plinkfx';
import {createFrame,clearFrame,createFx,composite} from '../../third_party/gamedev/pixelfx/src/core/fx.js';
import * as hitFx from '../../third_party/gamedev/pixelfx/src/fx/impacts/hit-spark.js';
import * as rewardFx from '../../third_party/gamedev/pixelfx/src/fx/ui/coin-collect.js';
const SIZE=64,frame=createFrame(SIZE,SIZE,SIZE/2,SIZE/2);
const scratch=document.createElement('canvas');scratch.width=SIZE;scratch.height=SIZE;
const scratchCtx=scratch.getContext('2d'),pixels=scratchCtx.createImageData(SIZE,SIZE);
let active=null,elapsed=0,lastTrigger=-Infinity;
export function enableAudio(){try{unlockAudio();return true;}catch{return false;}}
export function trigger(kind,time,soundEnabled){
 if(!['hit','reward','win'].includes(kind)||time-lastTrigger<.1)return;
 lastTrigger=time;
 try{active=createFx(kind==='hit'?hitFx:rewardFx,{x:0,y:0});elapsed=0;}catch{active=null;}
 if(soundEnabled){try{play(kind==='hit'?'hit':'coin',{volume:.2});}catch{/* optional audio */}}
}
export function drawFx(ctx,width,height,dt){
 if(!active)return;
 elapsed+=dt;
 if(elapsed>.6){active=null;return;}
 try{
  clearFrame(frame);active.update(dt);active.draw(frame);
  composite(frame,pixels.data,0x00000000);
  scratchCtx.putImageData(pixels,0,0);
  ctx.save();ctx.imageSmoothingEnabled=false;
  const size=Math.min(96,width*.25,height*.25);
  ctx.drawImage(scratch,(width-size)/2,(height-size)/2,size,size);
  ctx.restore();
  if(active.done())active=null;
 }catch{active=null;}
}
