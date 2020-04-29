const convertNumberToString = number => {
  if (number % 1 === 0) {
    // integer
    return integerToString(number);
  }

  // 处理小数位
  const nNumber = Math.abs(number);
  let point = (nNumber*10e8 - Math.floor(nNumber)*10e8) / 10e8;
  while (point - Math.floor(point) > Number.EPSILON) {
    point *= 10;
  }

  if (number < 0) {
    return integerToString(Math.ceil(number)) + "." + integerToString(point);
  }
  return integerToString(Math.floor(number)) + "." + integerToString(point);
};

// integer => string
const integerToString = number => {
  const f0 = "0".codePointAt(0);

  // 先按正数处理
  const uInt = number < 0 ? (0-number) : number;
  if (uInt < 10) {
    return String.fromCodePoint(f0 + uInt)
  }
  let result = "";
  let n = uInt;
  while (n > 0) {
    const newS = String.fromCodePoint(f0 + (n % 10));
    result = newS + result;
    n = Math.floor(n / 10);
  }

  // 处理负数
  if (number < 0) {
    result = "-" + result;
  }
  return result;
}
