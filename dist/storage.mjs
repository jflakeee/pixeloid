import {KEY,encode,decode} from './core.mjs';
export function restoreBackup(storage){
 const raw=storage.getItem(KEY+'-backup');
 if(!raw)throw new Error('복원할 백업이 없습니다');
 const state=decode(raw); // Validate before replacing the current save.
 storage.setItem(KEY,encode(state));
 return state;
}
