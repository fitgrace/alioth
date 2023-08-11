export const toString = (v: any) => Object.prototype.toString.call(v);

export function getTypeName(v: any) {
  if (v === null) return 'null';
  const type = toString(v).slice(8, -1).toLowerCase();
  return typeof v === 'object' || typeof v === 'function' ? type : typeof v;
}
