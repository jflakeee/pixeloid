export function movePointer(pointer, x, y) {
 const delta = {x: x - pointer.x, y: y - pointer.y};
 pointer.x = x;
 pointer.y = y;
 pointer.dragged ||= Math.hypot(x - pointer.startX, y - pointer.startY) >= 10;
 return delta;
}

export function anchoredPan(pan, center, previous, next, ratio) {
 return {
  x: next.x - center.x - (previous.x - center.x - pan.x) * ratio,
  y: next.y - center.y - (previous.y - center.y - pan.y) * ratio
 };
}
