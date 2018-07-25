const has = (o, k) => (o ? Object.prototype.hasOwnProperty.call(o, k) : false)

export default function isShallowEqual(a, b) {
  if (a === b) return true
  if (a instanceof Date && b instanceof Date) return +a === +b
  if (typeof a !== 'object' && typeof b !== 'object') return a === b
  if (typeof a !== typeof b) return false
  if (a == null || b == null) return false // if they were both null we wouldn't be here

  let keysA = Object.keys(a)
  let keysB = Object.keys(b)

  if (keysA.length !== keysB.length) return false
  for (let i = 0; i < keysA.length; i++)
    if (!has(b, keysA[i]) || a[keysA[i]] !== b[keysA[i]]) return false
  return true
}
