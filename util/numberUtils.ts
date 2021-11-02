
export const leadingZeros = (num : number, zeros = 4) => {
  let n = String(num);
  const l = n.length;
  for (let i = 0; i < zeros - l; i++) {
    n = "0" + n;
  }
  return n;
}