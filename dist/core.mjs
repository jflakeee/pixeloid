export const W=96,H=64,KEY='pixeloid-demo-v1';
export const TYPES=[{name:'기본',color:'#c5ffe8',speed:30},{name:'관통',color:'#7caeff',speed:22},{name:'전격',color:'#ffd169',speed:22}];
export function fresh(){
 const s={version:2,counts:[3,0,0],targets:[null,null,null],started:false,grid:[],hp:[],balls:[],owned:3,money:0,mined:0,total:0,time:0,target:{x:32,y:32},speed:0,won:false,events:[],devices:[{name:'반사판',x:38,y:32,r:2,active:false,dir:0},{name:'발전기',x:61,y:32,r:2,active:false,charge:0},{name:'핵심 유물',x:83,y:32,r:2,active:false}],selected:0};
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){let t=x===0||y===0||x===W-1||y===H-1?4:1;if(t!==4){if(x>24&&x<34&&y>24&&y<39)t=2;else if(x>43&&x<70&&((x+y)%9<5))t=3;else if((x*17+y*31)%37<3)t=2;}if(x>=8&&x<=19&&y>=26&&y<=38)t=0;for(const d of s.devices)if(Math.abs(x-d.x)<=d.r&&Math.abs(y-d.y)<=d.r)t=4;s.grid.push(t);s.hp.push([0,1,5,2,Infinity][t]);if(t>0&&t<4)s.total++;}
 return s;
}
export function notify(s,text){s.events.push({text,time:s.time});if(s.events.length>4)s.events.shift();}
export function hit(s,x,y,damage=1,source='ball'){
 x=Math.floor(x);y=Math.floor(y);if(x<0||y<0||x>=W||y>=H)return false;const i=y*W+x,t=s.grid[i];if(!t||t===4)return false;
 s.hp[i]-=damage;if(s.hp[i]<=0){s.grid[i]=0;s.hp[i]=0;s.mined++;s.money+=[0,1,3,2][t];
 for(const d of s.devices)if(d.name==='발전기'&&d.active&&source!=='generator'&&Math.hypot(x-d.x,y-d.y)<18)d.charge=Math.min(30,d.charge+1);
 }return true;
}
export function frontier(s,tx,ty){
 // ponytail: flood-fill on user actions only; chunk connectivity if maps exceed this 96×64 sample.
 const seen=new Uint8Array(W*H),q=[32*W+12];seen[q[0]]=1;let best={x:12.5,y:32.5},score=Infinity;
 for(let k=0;k<q.length;k++){const i=q[k],x=i%W,y=Math.floor(i/W),v=(x-tx)**2+(y-ty)**2;if(v<score){score=v;best={x:x+.5,y:y+.5};}for(const [dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const a=x+dx,b=y+dy,j=b*W+a;if(a>=0&&b>=0&&a<W&&b<H&&!seen[j]&&s.grid[j]===0){seen[j]=1;q.push(j);}}}return best;
}
export function workTarget(s,target=s.target){
 const d=s.devices.find(d=>Math.abs(target.x-d.x)<=2&&Math.abs(target.y-d.y)<=2);if(!d)return target;
 let best=null,score=Infinity;for(let y=d.y-3;y<=d.y+3;y++)for(let x=d.x-3;x<=d.x+3;x++){if(Math.max(Math.abs(x-d.x),Math.abs(y-d.y))!==3||s.grid[y*W+x]===0)continue;const v=(x-12)**2+(y-32)**2;if(v<score){score=v;best={x:x+.5,y:y+.5};}}return best??target;
}
function newBall(s,type,target,i=0,count=1){const t=workTarget(s,target),p=frontier(s,t.x,t.y);return {x:p.x,y:p.y,a:Math.atan2(t.y-p.y,t.x-p.x)+(i-(count-1)/2)*.14,type,cool:0,idle:0,boost:0};}
export function deploy(s,type=s.selected){
 if(![0,1,2].includes(type)||!s.counts[type])return false;
 s.targets[type]={...s.target};s.balls=s.balls.filter(b=>b.type!==type);
 for(let i=0;i<s.counts[type];i++)s.balls.push(newBall(s,type,s.targets[type],i,s.counts[type]));
 notify(s,TYPES[type].name+' '+s.counts[type]+'개를 보냈습니다');return true;
}
export function configure(s,counts){
 if(!Array.isArray(counts)||counts.length!==3||counts.some(n=>!Number.isInteger(n)||n<0)||counts.reduce((a,b)=>a+b,0)!==s.owned)return false;
 s.counts=[...counts];s.balls=[];s.targets=[null,null,null];if(s.started)for(let type=0;type<3;type++)if(counts[type])deploy(s,type);return true;
}
export function cost(s){return [40,70,110,160,220,300,400,520,670][s.owned-3]??Infinity;}
export function buy(s){const c=cost(s);if(s.money<c)return false;s.money-=c;s.owned++;s.counts[s.selected]++;const target=s.targets[s.selected]??s.target;s.targets[s.selected]={...target};if(s.started)s.balls.push(newBall(s,s.selected,target));return true;}
export function progress(s,d){let removed=0,total=0;for(let y=d.y-3;y<=d.y+3;y++)for(let x=d.x-3;x<=d.x+3;x++){if(Math.max(Math.abs(x-d.x),Math.abs(y-d.y))!==3)continue;total++;if(s.grid[y*W+x]===0)removed++;}return removed/total;}
export function activate(s,n){const d=s.devices[n];if(d.active){if(n===0)d.dir=(d.dir+1)%4;return false;}if(progress(s,d)<.8)return false;d.active=true;if(n===1)d.charge=30;if(n===2){s.won=true;notify(s,'핵심 유물을 발견했습니다!');}else notify(s,d.name+' 복원 완료');return true;}
function solid(s,x,y){if(x<1||y<1||x>=W-1||y>=H-1)return true;return s.grid[Math.floor(y)*W+Math.floor(x)]!==0;}
export function step(s,dt){s.time+=dt;const targets=s.targets.map(t=>workTarget(s,t??s.target));for(const b of s.balls){const target=targets[b.type];b.cool=Math.max(0,b.cool-dt);b.boost=Math.max(0,b.boost-dt);b.idle+=dt;let desired=Math.atan2(target.y-b.y,target.x-b.x),delta=Math.atan2(Math.sin(desired-b.a),Math.cos(desired-b.a));b.a+=Math.max(-dt*1.4,Math.min(dt*1.4,delta));const distance=TYPES[b.type].speed*(1+s.speed*.15)*dt,n=Math.max(1,Math.ceil(distance/.25));for(let j=0;j<n;j++){const dx=Math.cos(b.a)*distance/n,dy=Math.sin(b.a)*distance/n,nx=b.x+dx,ny=b.y+dy;if(!solid(s,nx,ny)){b.x=nx;b.y=ny;continue;}const x=Math.max(0,Math.min(W-1,Math.floor(nx))),y=Math.max(0,Math.min(H-1,Math.floor(ny)));let power=b.type===1&&b.cool===0?3:1;if(b.boost>0)power+=2;const struck=hit(s,x,y,power);if(struck){b.idle=0;b.boost=0;if(b.type===1&&b.cool===0){b.cool=1;if(s.grid[y*W+x]===0)hit(s,x+Math.sign(dx),y+Math.sign(dy),1);}if(b.type===2&&b.cool===0){b.cool=1;let count=0;for(let yy=y-2;yy<=y+2&&count<2;yy++)for(let xx=x-2;xx<=x+2&&count<2;xx++)if(xx>0&&yy>0&&xx<W-1&&yy<H-1&&s.grid[yy*W+xx]===3){hit(s,xx,yy,1);count++;}}}
 let redirected=false;for(const d of s.devices)if(d.active&&Math.abs(x-d.x)<=2&&Math.abs(y-d.y)<=2&&d.name==='반사판'){b.boost=4;const a=d.dir*Math.PI/2,ex=d.x+.5+Math.cos(a)*3,ey=d.y+.5+Math.sin(a)*3;if(!solid(s,ex,ey)){b.x=ex;b.y=ey;b.a=a;redirected=true;}else hit(s,ex,ey,1);}if(redirected)continue;
 if(!solid(s,nx,ny)){b.x=nx;b.y=ny;}else if(solid(s,nx,b.y))b.a=Math.PI-b.a;else b.a=-b.a;
 }}
 const g=s.devices[1];if(g.active&&g.charge>=30){let targets=[];for(let y=g.y-14;y<=g.y+14;y++)for(let x=g.x-14;x<=g.x+14;x++)if(x>0&&y>0&&x<W-1&&y<H-1&&s.grid[y*W+x]===3)targets.push({x,y,d:Math.hypot(x-g.x,y-g.y)});targets.sort((a,b)=>a.d-b.d);if(targets.length){g.charge=0;for(const p of targets.slice(0,6))hit(s,p.x,p.y,2,'generator');notify(s,'발전기 방전 · 주변 광맥 채굴');}}
}
export function encode(s){return JSON.stringify(s);}
export function decode(raw){const s=JSON.parse(raw);if(!s||![1,2].includes(s.version)||s.grid?.length!==W*H||s.hp?.length!==W*H||!Array.isArray(s.balls)||s.balls.length>12||!Number.isInteger(s.owned)||s.owned<3||s.owned>12||!Number.isFinite(s.money)||s.money<0||!s.devices||s.devices.length!==3||!s.target||!Number.isFinite(s.target.x)||!Number.isFinite(s.target.y)||!Number.isFinite(s.time)||!Number.isFinite(s.mined)||!Number.isFinite(s.total))throw Error('저장 형식 오류');if(s.grid.some(t=>![0,1,2,3,4].includes(t)))throw Error('지도 오류');for(const b of s.balls)if(![0,1,2].includes(b.type)||![b.x,b.y,b.a,b.cool,b.idle,b.boost].every(Number.isFinite)||b.x<0||b.y<0||b.x>=W||b.y>=H)throw Error('구체 오류');if(!Number.isInteger(s.speed)||s.speed<0||s.speed>3||![0,1,2].includes(s.selected))throw Error('강화 상태 오류');
 if(s.hp.some((v,i)=>s.grid[i]!==4&&(!Number.isFinite(v)||v<0)))throw Error('내구도 오류');
 if(s.devices.some(d=>!d||!Number.isFinite(d.x)||!Number.isFinite(d.y)||typeof d.active!=='boolean'))throw Error('장치 오류');
 if(s.version===1){s.counts=[0,0,0];for(const b of s.balls)s.counts[b.type]++;s.counts[0]+=s.owned-s.balls.length;s.targets=[0,1,2].map(()=>({...s.target}));s.version=2;}
 if(!Array.isArray(s.counts)||s.counts.length!==3||s.counts.some(n=>!Number.isInteger(n)||n<0)||s.counts.reduce((a,b)=>a+b,0)!==s.owned)throw Error('구성 오류');
 if(!Array.isArray(s.targets)||s.targets.length!==3||s.targets.some(t=>t!==null&&(!Number.isFinite(t.x)||!Number.isFinite(t.y))))throw Error('목표 오류');
 if(s.started&&s.balls.length!==s.owned)throw Error('구체 수 오류');
 for(let type=0;type<3;type++)if(s.started&&s.balls.filter(b=>b.type===type).length!==s.counts[type])throw Error('유형 수 오류');
 s.hp=s.hp.map((v,i)=>s.grid[i]===4?Infinity:v);s.events=[];return s;}
