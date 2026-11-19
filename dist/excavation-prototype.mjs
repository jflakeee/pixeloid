import {createWorld,WORLD_WIDTH,WORLD_HEIGHT,CHUNK_SIZE} from './world-prototype.mjs';
// Sparse excavation overlay; original generation remains immutable.
export function createExcavation(seed,raw=null){
 const world=createWorld(seed),removed=new Set();
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
  if(t===0||t===4||removed.has(i))return false;
  removed.add(i);return true;
 }
 if(raw!==null){
  const data=JSON.parse(raw);
  if(!data||data.version!==1||data.seed!==(seed>>>0)||!Array.isArray(data.removed)||data.removed.length>WORLD_WIDTH*WORLD_HEIGHT)throw Error('invalid overlay');
  for(const i of data.removed){
   if(!Number.isInteger(i)||i<0||i>=WORLD_WIDTH*WORLD_HEIGHT||!mine(i%WORLD_WIDTH,Math.floor(i/WORLD_WIDTH)))throw Error('invalid excavation');
  }
 }
 return {mine,cell(x,y){const i=index(x,y);return removed.has(i)?0:original(x,y);},encode(){return JSON.stringify({version:1,seed:seed>>>0,removed:[...removed].sort((a,b)=>a-b)});},get mined(){return removed.size}};
}
