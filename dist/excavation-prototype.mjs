import {createWorld,WORLD_WIDTH,WORLD_HEIGHT,CHUNK_SIZE} from './world-prototype.mjs';
// Sparse excavation overlay; original generation remains immutable.
export function createExcavation(seed,raw=null){
 const world=createWorld(seed),removed=new Uint8Array(Math.ceil(WORLD_WIDTH*WORLD_HEIGHT/8));
 let mined=0;
 const has=i=>Boolean(removed[i>>>3]&(1<<(i&7)));
 const mark=i=>{removed[i>>>3]|=1<<(i&7);mined++;};
 function index(x,y){
  if(!Number.isInteger(x)||!Number.isInteger(y)||x<0||y<0||x>=WORLD_WIDTH||y>=WORLD_HEIGHT)throw Error('invalid cell');
  return y*WORLD_WIDTH+x;
 }
 function original(x,y){
  const c=world.chunk(Math.floor(x/CHUNK_SIZE),Math.floor(y/CHUNK_SIZE));
  return c.cells[(y%CHUNK_SIZE)*c.width+x%CHUNK_SIZE];
 }
 function mine(x,y){
  const i=index(x,y),t=original(x,y);
  if(t===0||t===4||has(i))return false;
  mark(i);return true;
 }
 if(raw!==null){
  const data=JSON.parse(raw);
  if(!data||![1,2].includes(data.version)||data.seed!==(seed>>>0))throw Error('invalid overlay');
  let indices;
  if(data.version===1){
   if(!Array.isArray(data.removed)||data.removed.length>WORLD_WIDTH*WORLD_HEIGHT)throw Error('invalid overlay');
   indices=data.removed;
  }else{
   if(typeof data.bits!=='string'||data.bits.length!==removed.length*2||!/^[0-9a-f]+$/.test(data.bits))throw Error('invalid bitmask');
   indices=(function*(){for(let j=0;j<removed.length;j++){const byte=parseInt(data.bits.slice(j*2,j*2+2),16);for(let k=0;k<8;k++)if(byte&(1<<k))yield j*8+k;}})();
  }
  for(const i of indices){
   if(!Number.isInteger(i)||i<0||i>=WORLD_WIDTH*WORLD_HEIGHT||!mine(i%WORLD_WIDTH,Math.floor(i/WORLD_WIDTH)))throw Error('invalid excavation');
  }
 }
 return {mine,cell(x,y){const i=index(x,y);return has(i)?0:original(x,y);},encode(){return JSON.stringify({version:2,seed:seed>>>0,bits:Array.from(removed,v=>v.toString(16).padStart(2,'0')).join('')});},get mined(){return mined}};
}
