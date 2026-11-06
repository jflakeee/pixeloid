import {KEY,encode,decode,fresh} from './core.mjs';
export function restoreBackup(storage,source='backup'){
 if(!['backup','before-reset'].includes(source))throw new Error('알 수 없는 백업');
 const raw=storage.getItem(KEY+'-'+source);
 if(!raw)throw new Error('복원할 백업이 없습니다');
 const state=decode(raw); // Validate before replacing the current save.
 storage.setItem(KEY,encode(state));
 return state;
}

export function resetSave(storage,current){
 // Separate snapshot survives later automatic-save rotation.
 const snapshot=encode(current);decode(snapshot);
 const next=fresh();
 storage.setItem(KEY+'-before-reset',snapshot);
 storage.setItem(KEY,encode(next));
 return next;
}

export function saveProgress(storage, state) {
 const next = encode(state);
 decode(next);
 const previous = storage.getItem(KEY);
 if (previous === next) return false;
 if (previous) {
  decode(previous);
  storage.setItem(KEY+'-backup', previous);
 }
 storage.setItem(KEY, next);
 return true;
}
