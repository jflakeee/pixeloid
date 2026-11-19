import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true});
try{
 const context=await browser.newContext();
 const a=await context.newPage(),b=await context.newPage();
 await Promise.all([a,b].map(p=>p.goto('http://127.0.0.1:8765/')));
 const setup=async p=>p.evaluate(async()=>{window.store=await import('/world-store-prototype.mjs');window.db=await store.openWorldStore();});
 await setup(a);await setup(b);
 const write=(p,rev,value)=>p.evaluate(async({rev,value})=>{const bits=new Uint8Array(1250000);bits[0]=value;return store.writeSnapshot(db,42,bits,rev);},{rev,value});
 const read=(p,source)=>p.evaluate(async source=>{const s=await store.readSnapshot(db,source);return s&&{revision:s.revision,value:s.bits[0]};},source);
 assert.equal(await read(a,'current'),null);
 assert.equal(await write(a,0,1),1);
 const race=await Promise.allSettled([write(a,1,2),write(b,1,4)]);
 assert.equal(race.filter(r=>r.status==='fulfilled').length,1);
 assert.equal(race.filter(r=>r.status==='rejected').length,1);
 const current=await read(a,'current');
 assert.equal(current.revision,2);
 assert.deepEqual(await read(b,'backup'),{revision:1,value:1});
 await assert.rejects(write(b,1,8));
 assert.deepEqual(await read(a,'current'),current);
 await a.reload();await setup(a);
 assert.deepEqual(await read(a,'current'),current);
 // Restore the previous snapshot as a new revision, never rewind revision.
 assert.equal(await a.evaluate(async()=>{const backup=await store.readSnapshot(db,'backup');return store.writeSnapshot(db,backup.seed,backup.bits,2);}),3);
 assert.deepEqual(await read(b,'current'),{revision:3,value:1});
 console.log('PASS IndexedDB contention, stale write abort, reload, backup recovery');
}finally{await browser.close();}
