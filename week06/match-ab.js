// match 'ab'
function match(str) {
  let state = start;
  for(let c of str) {
    state = state(c);
  }
  return state === end;
}

function end(c) {
  return end;
}

function start(c) {
  if (c === 'a') {
    return foundA;
  }
  return start;
}

function foundA(c) {
  if (c === 'b') {
    return end;
  }
  return start(c);
}

// console.log(match('aibbj')); // false
console.log(match('jioajuvbaab')); // true
