// match 'abcabx'
function match(str) {
  let state = start;
  for (let c of str) {
    state = state(c);
  }
  return state === end;
}

function start(c) {
  if (c === 'a') {
    return foundA;
  }
  return start;
}

function foundA(c) {
  if (c === 'b') {
    return foundB;
  }
  return start(c);
}

function foundB(c) {
  if (c === 'a') {
    return foundA2;
  }
  return start(c);
}

function foundA2(c) {
  if (c === 'b') {
    return foundB2;
  }
  return start(c);
}

function foundB2(c) {
  if (c === 'a') {
    return foundA3;
  }
  return start(c);
}

function foundA3(c) {
  if (c === 'b') {
    return foundB3;
  }
  return start(c);
}

function foundB3(c) {
  if (c === 'x') {
    return end;
  }
  return foundB3;
}

function end(c) {
  return end;
}

console.log(match('abababx'));  // true
console.log(match('abababababababx'));  // true
console.log(match('fdafdsa'));  // false
