// Isolated IndexedDB snapshot store. The caller must hold the world writer lock.
export function openWorldStore(factory=globalThis.indexedDB){
 return new Promise((resolve,reject)=>{
  if(!factory){reject(Error('IndexedDB unavailable'));return;}
  const req=factory.open('pixeloid-world-prototype',1);
  req.onupgradeneeded=()=>req.result.createObjectStore('snapshots');
  req.onerror=()=>reject(req.error);
  req.onblocked=()=>reject(Error('database upgrade blocked'));
  req.onsuccess=()=>resolve(req.result);
 });
}
export function writeSnapshot(db,seed,bits,expectedRevision=0){
 if(!Number.isInteger(seed)||seed<0||seed>0xffffffff||!(bits instanceof Uint8Array)||bits.length!==1250000||!Number.isSafeInteger(expectedRevision)||expectedRevision<0||expectedRevision>=Number.MAX_SAFE_INTEGER)return Promise.reject(Error('invalid snapshot'));
 const copy=bits.slice();
 return new Promise((resolve,reject)=>{
  const tx=db.transaction('snapshots','readwrite'),store=tx.objectStore('snapshots');
  let failure,revision;
  tx.oncomplete=()=>resolve(revision);
  tx.onabort=()=>reject(failure||tx.error||Error('snapshot aborted'));
  const req=store.get('current');
  req.onsuccess=()=>{
   const prev=req.result;
   if((prev?.revision??0)!==expectedRevision||(prev&&prev.seed!==seed)){failure=Error('snapshot conflict');tx.abort();return;}
   revision=expectedRevision+1;
   if(prev)store.put(prev,'backup');
   store.put({version:1,seed,revision,bits:copy},'current');
  };
 });
}
export function readSnapshot(db,source='current'){
 if(!['current','backup'].includes(source))return Promise.reject(Error('invalid source'));
 return new Promise((resolve,reject)=>{
  const tx=db.transaction('snapshots','readonly'),req=tx.objectStore('snapshots').get(source);
  tx.onabort=()=>reject(tx.error||Error('read aborted'));
  tx.oncomplete=()=>{const v=req.result;if(v!==undefined&&(!v||v.version!==1||!Number.isInteger(v.seed)||v.seed<0||v.seed>0xffffffff||!Number.isSafeInteger(v.revision)||v.revision<1||!(v.bits instanceof Uint8Array)||v.bits.length!==1250000)){reject(Error('invalid stored snapshot'));return;}resolve(v??null);};
 });
}
