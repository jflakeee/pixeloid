import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fresh,encode,decode,KEY,W,deploy,step} from '../dist/core.mjs';
import {saveProgress,restoreBackup,resetSave} from '../dist/storage.mjs';

const tests=[];
const test=(id,description,fn)=>tests.push({id,description,fn});
const raw=state=>encode(state);
function store(entries=[],failAt=0){
 const data=new Map(entries), writes=[];
 return {data,writes,getItem:k=>data.get(k)??null,setItem(k,v){writes.push(k);if(failAt&&writes.length===failAt)throw Error('Injected QuotaExceededError');data.set(k,v);}};
}
const clone=s=>structuredClone(s);
function oldV1(){const s=fresh();s.started=true;deploy(s);s.money=43;s.mined=0;s.version=1;delete s.counts;delete s.targets;return s;}
test('P0-01','fresh v2 roundtrip',()=>{const s=fresh();s.money=123;s.speed=1;const r=decode(raw(s));assert.equal(r.version,2);assert.equal(r.money,123);assert.equal(r.speed,1);});
test('P0-02','v1 migration',()=>{const s=oldV1(),r=decode(raw(s));assert.equal(r.version,2);assert.equal(r.money,43);assert.deepEqual(r.counts,[3,0,0]);assert.equal(r.targets.length,3);});
test('P0-03','corrupt JSON or shape cannot replace valid save',()=>{const s=store([[KEY,raw(fresh())],[KEY+'-backup','{broken']]);const prior=s.data.get(KEY);assert.throws(()=>decode('{'));assert.throws(()=>decode('{}'));assert.throws(()=>restoreBackup(s));assert.equal(s.data.get(KEY),prior);});
test('P0-04','progress bounds and target rejection',()=>{for(const fn of [s=>s.money=-1,s=>s.time=-1,s=>s.total=0,s=>s.mined=s.total+1,s=>s.target.x=W,s=>s.money=NaN]){const s=fresh();fn(s);assert.throws(()=>decode(raw(s)));}});
test('P0-05','invalid devices, balls, counts rejected',()=>{for(const fn of [s=>s.devices[0].x=999,s=>s.devices[1].charge=31,s=>s.counts=[1,1,0],s=>s.balls=[{type:99,x:1,y:1,a:0,cool:0,idle:0,boost:0}]]){const s=fresh();fn(s);assert.throws(()=>decode(raw(s)));}});
test('P0-06','identical save does not rotate backup',()=>{const s=fresh(),m=store();assert.equal(saveProgress(m,s),true);const n=m.writes.length;assert.equal(saveProgress(m,s),false);assert.equal(m.writes.length,n);});
test('P0-07','backup write failure leaves primary and backup intact',()=>{const p=raw(fresh()),m=store([[KEY,p],[KEY+'-backup',p]],1),s=fresh();s.money=8;assert.throws(()=>saveProgress(m,s));assert.equal(m.data.get(KEY),p);assert.equal(m.data.get(KEY+'-backup'),p);});
test('P0-08','primary write failure preserves primary; backup is prior primary',()=>{const p=raw(fresh()),m=store([[KEY,p]],2),s=fresh();s.money=8;assert.throws(()=>saveProgress(m,s));assert.equal(m.data.get(KEY),p);assert.equal(m.data.get(KEY+'-backup'),p);});
test('P0-09','missing and invalid backups never replace primary',()=>{const p=raw(fresh()),m=store([[KEY,p]]);assert.throws(()=>restoreBackup(m));m.data.set(KEY+'-backup','broken');assert.throws(()=>restoreBackup(m));assert.equal(m.data.get(KEY),p);});
test('P0-10','restore write failure retains current and backup',()=>{const p=raw(fresh()),b=fresh();b.money=77;const m=store([[KEY,p],[KEY+'-backup',raw(b)]],1);assert.throws(()=>restoreBackup(m));assert.equal(m.data.get(KEY),p);assert.equal(decode(m.data.get(KEY+'-backup')).money,77);});
test('P0-11','reset snapshot write failure leaves live state intact',()=>{const s=fresh();s.money=45;const p=raw(s),m=store([[KEY,p]],1);assert.throws(()=>resetSave(m,s));assert.equal(m.data.get(KEY),p);assert.equal(raw(s),p);});
test('P0-12','reset primary write failure preserves valid primary',()=>{const s=fresh();s.money=45;const p=raw(s),m=store([[KEY,p]],2);assert.throws(()=>resetSave(m,s));assert.equal(m.data.get(KEY),p);assert.equal(decode(m.data.get(KEY+'-before-reset')).money,45);assert.equal(raw(s),p);});
test('P0-13','before-reset survives autosave rotation',()=>{const s=fresh();s.money=99;const m=store([[KEY,raw(s)]]);const reset=resetSave(m,s);reset.money=5;saveProgress(m,reset);assert.equal(restoreBackup(m,'before-reset').money,99);});
test('P0-14','Node reload simulation preserves saved state (browser pending)',()=>{const s=fresh(),m=store();s.money=88;saveProgress(m,s);const next=decode(m.getItem(KEY));assert.equal(next.money,88);});
test('P0-15','quota failure cannot claim save success at API layer (browser UX pending)',()=>{const s=fresh(),m=store([],1);assert.throws(()=>saveProgress(m,s));assert.equal(m.getItem(KEY),null);});
test('P0-16','KNOWN RISK: two tabs can overwrite newer progress (reproduction only)',()=>{const m=store(),a=fresh();saveProgress(m,a);const b=decode(m.getItem(KEY));a.money=100;saveProgress(m,a);b.money=1;saveProgress(m,b);assert.equal(decode(m.getItem(KEY)).money,1);});
test('P0-17','pause/save transitions preserve valid progress (dialog/browser pending)',()=>{const m=store(),s=fresh();s.started=true;deploy(s);step(s,1/60);saveProgress(m,s);const r=decode(m.getItem(KEY));assert.equal(r.started,true);assert.equal(r.balls.length,3);});
test('P0-18','v1/v2 fixtures remain loadable and version unchanged',()=>{const one=decode(raw(oldV1())),two=decode(raw(fresh()));assert.equal(one.version,2);assert.equal(two.version,2);assert.equal(KEY,'pixeloid-demo-v1');});
// Static integration guard: browser event behavior still needs a real two-tab test.
test('P0-19','storage-event guard wired into app without save format changes',()=>{
 const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');
 assert.match(app,/addEventListener\('storage'/);
 assert.match(app,/event\.key!==KEY/);
 assert.match(app,/storageBlocked=true/);
 assert.match(app,/running=false/);
 assert.match(app,/localStorage\.getItem\(KEY\)!==observedSaveRaw/);
 assert.match(app,/observedSaveRaw=localStorage\.getItem\(KEY\)/);
});
let failed=0;
for(const {id,description,fn} of tests){try{await fn();console.log(id==='P0-16'?'RISK':'PASS',id,description);}catch(e){failed++;console.error('FAIL',id,description,e);}}
console.log(`P0 matrix: ${tests.length-failed}/${tests.length} Node scenarios passed (P0-16 reproduces an UNRESOLVED lost-update risk); browser-only aspects of P0-14..18 remain unverified.`);
if(failed)process.exitCode=1;
