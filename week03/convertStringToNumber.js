function convertStringToNumber(string, x) {
  if (arguments.length < 2) {
    x = 10;
  }
  const chars = string.split("");
  let n = 0;
  
  let i = 0;
  while(i < chars.length && chars[i] !== '.') {
    n *= 10;
    n += chars[i].codePointAt(0) - '0'.codePointAt(0);
    i++;
  }
  
  if(chars[i] === '.') {
    i++;
  }
  
  let fraction = 1;
  while(i < chars.length) {
    fraction = fraction / x;
    n += (chars[i].codePointAt(0) - '0'.codePointAt(0)) * fraction;
    i++;
  }
  return n;
}