// Cross-tab single-writer gate. The lock is held until release() or page unload.
// Unsupported browsers fail closed: no writes are allowed.
export function createWriterGate(locks, name) {
 let held=false, released=false, unlock=()=>{}, pending=null;
 const available=Boolean(locks&&typeof locks.request==='function');
 function start(){
  if(pending)return pending;
  if(!available)return Promise.resolve(false);
  let settled=false;
  pending=new Promise(resolve=>{
   const finish=value=>{if(!settled){settled=true;resolve(value);}};
   try {
    Promise.resolve(locks.request(name,{mode:'exclusive',ifAvailable:true},async lock=>{
     if(!lock||released){finish(false);return;}
     held=true;finish(true);
     await new Promise(done=>{unlock=done;});
     held=false;
    })).catch(()=>{held=false;finish(false);});
   }catch{finish(false);}
  });
  return pending;
 }
 return {
  get available(){return available;},
  get held(){return held&&!released;},
  start,
  release(){released=true;held=false;unlock();}
 };
}
