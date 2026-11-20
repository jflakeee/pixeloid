// Pure, bounded feedback event detection. Never writes to game state or storage.
export function createFeedbackDetector(){
 let prev=null;
 return {
  reset(s){prev={mined:s.mined,money:s.money,won:!!s.won};},
  read(s){
   const next={mined:s.mined,money:s.money,won:!!s.won};
   if(!prev){prev=next;return null;}
   const kind=next.won&&!prev.won?'win':next.money>prev.money?'reward':next.mined>prev.mined?'hit':null;
   prev=next;return kind;
  }
 };
}
