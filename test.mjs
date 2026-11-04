import assert from 'node:assert/strict';
import {fresh,hit,deploy,configure,step,buy,cost,encode,decode,activate,progress,W} from './dist/core.mjs';
const s=fresh();s.started=true;deploy(s);const i=s.grid.findIndex(t=>t===1),x=i%W,y=Math.floor(i/W);hit(s,x,y,99);const money=s.money,mined=s.mined;hit(s,x,y,99);assert.equal(s.money,money);assert.equal(s.mined,mined);
s.money=1000;const c=cost(s);assert(buy(s));assert.equal(s.owned,4);assert.equal(s.money,1000-c);assert.equal(s.counts[0],4);for(let i=0;i<600;i++)step(s,1/60);assert(s.mined>mined);assert(s.balls.every(b=>Number.isFinite(b.x)&&Number.isFinite(b.a)));const restored=decode(encode(s));assert.equal(restored.money,s.money);assert.equal(restored.mined,s.mined);assert.throws(()=>decode('{}'));
const d=s.devices[0];assert(!activate(s,0));for(let y=d.y-3;y<=d.y+3;y++)for(let x=d.x-3;x<=d.x+3;x++)if(Math.max(Math.abs(x-d.x),Math.abs(y-d.y))===3)hit(s,x,y,99);assert.equal(progress(s,d),1);assert(activate(s,0));assert(!activate(s,0));assert.equal(d.dir,1);
assert(configure(s,[2,1,1]));const other=JSON.stringify(s.balls.filter(b=>b.type!==1)),oldTarget={...s.targets[0]};s.target={x:80,y:30};assert(deploy(s,1));assert.equal(JSON.stringify(s.balls.filter(b=>b.type!==1)),other);assert.deepEqual(s.targets[0],oldTarget);assert.deepEqual(s.targets[1],s.target);const before=encode(s);assert(!configure(s,[4,1,0]));assert.equal(encode(s),before);assert(!configure(s,[-1,3,2]));assert.deepEqual(decode(encode(s)).counts,[2,1,1]);
const legacy=JSON.parse(encode(s));legacy.version=1;delete legacy.counts;delete legacy.targets;const migrated=decode(JSON.stringify(legacy));assert.deepEqual(migrated.counts,[2,1,1]);assert.equal(migrated.version,2);assert.equal(migrated.money,s.money);assert.equal(migrated.mined,s.mined);assert.deepEqual(migrated.balls,s.balls);
const route=fresh();route.owned=12;route.started=true;for(let n=0;n<3;n++){const d=route.devices[n];route.target={x:d.x,y:d.y};configure(route,n===0?[0,12,0]:[0,0,12]);let complete=false;for(let sec=0;sec<600;sec++){if(sec%2===0)deploy(route,n===0?1:2);for(let f=0;f<30;f++)step(route,1/30);if(progress(route,d)>=.8){activate(route,n);complete=true;break;}}assert(complete,'device '+n+' reachable');}assert(route.won);assert(route.mined<=route.total);console.log('PASS: rewards, purchases, simulation, device states, complete route, group isolation, configuration invariants, v1 migration, v2 roundtrip.');

// Restoration must never destroy the current save when the backup is invalid.
const {restoreBackup}=await import('./dist/storage.mjs');
const {KEY}=await import('./dist/core.mjs');
const saved=encode(fresh()), data=new Map([[KEY,saved],[KEY+'-backup','broken']]);
const storage={getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)};
assert.throws(()=>restoreBackup(storage));assert.equal(data.get(KEY),saved);
data.delete(KEY+'-backup');assert.throws(()=>restoreBackup(storage));
data.set(KEY+'-backup',encode(s));assert.equal(restoreBackup(storage).mined,s.mined);
assert.equal(decode(data.get(KEY)).mined,s.mined);
assert.equal(data.get(KEY+'-backup'),encode(s));
assert.throws(()=>restoreBackup({...storage,setItem(){throw new Error('Quota exceeded');}}));
console.log('PASS: backup restore, missing/corrupt backup protection, write failure.');
