var validVisibility = ['', 'visible', 'inherit']
export default function isElementVisible (el) {
  while (el && el.style && validVisibility.indexOf(el.style.visibility) >= 0) {
    el = el.parentNode
  }
  return !el || !el.style
}
