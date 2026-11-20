// Pure event detector: visual/audio feedback never mutates gameplay state or saves.
export function createFeedbackDetector(){
 let previous=null;
 return {
  reset(snapshot){previous={mined:snapshot.mined,money:snapshot.money,won:!!snapshot.won};},
  read(snapshot){
   const next={mined:snapshot.mined,money:snapshot.money,won:!!snapshot.won};
   if(!Number.isSafeInteger(next.mined)||!Number.isFinite(next.money)||next.mined<0)throw Error('invalid feedback snapshot');
   if(!previous){previous=next;return [];}
   const events=[];
   if(next.mined>previous.mined)events.push({type:'hit',count:next.mined-previous.mined});
   if(next.money>previous.money)events.push({type:'reward',amount:next.money-previous.money});
   if(next.won&&!previous.won)events.push({type:'win'});
   previous=next;
   return events;
  }
 };
}
