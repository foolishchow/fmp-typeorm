
export const pure = <T>(data: T): T => {
  return JSON.parse(JSON.stringify(data)) as T;
}


export function WeakEqual(origin: any, current: any): boolean {
  var o1 = origin instanceof Object;
  var o2 = current instanceof Object;
  // 判断是不是对象
  if (!o1 || !o2) {
    return origin === current;
  }
  //Object.keys() 返回一个由对象的自身可枚举属性(key值)组成的数组,
  //例如：数组返回下表：let arr = ["a", "b", "c"];console.log(Object.keys(arr))->0,1,2;
  if (Object.keys(origin).length !== Object.keys(current).length) {
    return false;
  }

  for (var o in origin) {
    var t1 = origin[o] instanceof Object;
    var t2 = current[o] instanceof Object;
    if (t1 && t2) {
      return WeakEqual(origin[o], current[o]);
    } else if (origin[o] !== current[o]) {
      return false;
    }
  }
  return true;

}