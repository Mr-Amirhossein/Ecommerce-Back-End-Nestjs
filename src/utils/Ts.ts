export function getClassType<T>(classType: {new (...args: any[]): T}): T {
  return classType.prototype;
}