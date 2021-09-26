
export const getFirstNElemnts = <T>(n : number, arr : T[]) : T[] => {

  const newArr : T[] = [];

  for (let i = 0; i < n; i++) {
    const e = arr[i];
    if (e) newArr.push(e);
  }

  return newArr;

}

export const getNextNElements = <T>(n: number, source: T[], dest: T[]) => {

  const length = dest.length;

  for (let i = length; i < length + n; i++) {
    const e = source[i];
    if (e) dest.push(e);
  }

  return dest;

}
