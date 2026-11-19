// P2-B isolated region prototype; not connected to live saves.
export const REGIONS=[
 {id:'crystal',name:'수정 동굴',weights:[45,40,15]},
 {id:'magma',name:'화산 광맥',weights:[35,20,45]},
 {id:'ruins',name:'고대 유적',weights:[55,30,15]}
];
export function generateRegion(id,seed,width=96,height=64){
 const region=REGIONS.find(r=>r.id===id);
 if(!region||!Number.isInteger(seed)||!Number.isInteger(width)||!Number.isInteger(height)||width<24||height<24||width>256||height>256)throw Error('invalid region');
 let state=seed>>>0;
 const grid=new Uint8Array(width*height);
 const counts=[0,0,0,0,0];
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){
  state=(Math.imul(state,1664525)+1013904223)>>>0;
  const roll=state/4294967296*100;
  const t=x===0||y===0||x===width-1||y===height-1?4:
   Math.abs(x-12)<=4&&Math.abs(y-Math.floor(height/2))<=4?0:
   roll<region.weights[0]?1:roll<region.weights[0]+region.weights[1]?2:3;
  grid[y*width+x]=t;counts[t]++;
 }
 return {id,seed:seed>>>0,width,height,grid,counts};
}
