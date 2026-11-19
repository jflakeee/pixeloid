// Isolated P2-C prototype. Logical world: 4000 x 2500 = 10 million cells.
export const WORLD_WIDTH=4000,WORLD_HEIGHT=2500,CHUNK_SIZE=64;
export function createWorld(seed,capacity=32){
 if(!Number.isInteger(seed)||!Number.isInteger(capacity)||capacity<1||capacity>128)throw Error('invalid world options');
 const cache=new Map();
 function chunk(cx,cy){
  if(!Number.isInteger(cx)||!Number.isInteger(cy)||cx<0||cy<0||cx*CHUNK_SIZE>=WORLD_WIDTH||cy*CHUNK_SIZE>=WORLD_HEIGHT)throw Error('invalid chunk');
  const key=cx+','+cy;
  if(cache.has(key)){const value=cache.get(key);cache.delete(key);cache.set(key,value);return value;}
  const width=Math.min(CHUNK_SIZE,WORLD_WIDTH-cx*CHUNK_SIZE),height=Math.min(CHUNK_SIZE,WORLD_HEIGHT-cy*CHUNK_SIZE);
  const cells=new Uint8Array(width*height);
  for(let y=0;y<height;y++)for(let x=0;x<width;x++){
   const gx=cx*CHUNK_SIZE+x,gy=cy*CHUNK_SIZE+y;
   let h=Math.imul(gx^seed,0x45d9f3b)^Math.imul(gy,0x119de1f3);h=Math.imul(h^(h>>>16),0x45d9f3b);h=(h^(h>>>16))>>>0;
   cells[y*width+x]=gx===0||gy===0||gx===WORLD_WIDTH-1||gy===WORLD_HEIGHT-1?4:gx>=8&&gx<=19&&gy>=26&&gy<=38?0:h%100<60?1:h%100<85?2:3;
  }
  if(cache.size>=capacity)cache.delete(cache.keys().next().value);
  const value={width,height,cells};cache.set(key,value);return value;
 }
 return {chunk,get cachedChunks(){return cache.size},get cachedBytes(){return [...cache.values()].reduce((n,c)=>n+c.cells.byteLength,0)}};
}
