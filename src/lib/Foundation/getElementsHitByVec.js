export default function getElementsHitByVec (x, y, vec, step, limit) {
  var els = []
  var el = null
  step = Math.max(5, step) || 5
  limit = Math.max(0, limit) || Infinity

  el = document.elementFromPoint(x, y)
  while (el && els.length <= limit) {
    if (els.indexOf(el) < 0) els.push(el)
    step += step
    el = document.elementFromPoint(x + (vec.x * step), y + (vec.y * step))
  }

  return els
}
