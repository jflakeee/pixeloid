export function movePointer(pointer, x, y) {
 const delta = {x: x - pointer.x, y: y - pointer.y};
 pointer.x = x;
 pointer.y = y;
 pointer.dragged ||= Math.hypot(x - pointer.startX, y - pointer.startY) >= 10;
 return delta;
}
