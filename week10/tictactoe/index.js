const LIST = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

const VALUE_MAP = {
  0: "",
  1: "❌",
  2: "⭕",
};

let color = 1;

const root = document.getElementById("root");

const draw = () => {
  root.innerHTML = null;
  LIST.forEach((l, x) => {
    const div = document.createElement("div");
    div.className = "line";
    l.forEach((lf, y) => {
      const lfd = document.createElement("div");
      lfd.className = "block";
      lfd.innerText = VALUE_MAP[lf];
      lfd.addEventListener("click", () => userMove(y, x));
      div.appendChild(lfd);
    });
    root.appendChild(div);
  });
};

function userMove( x, y, cell){
  if(LIST[y][x]) return;
  LIST[y][x] = color;
  color = 3 - color;
  draw();
  computerMove();
}

function computerMove(){
  let choice = bestChoice(LIST, color);
  if(choice.point){
    LIST[choice.point[1]][choice.point[0]] = color;
  }
  color = 3 - color;
  draw();
}

const willWin = (LIST, color) => {
  for(let i =0; i < 3; i++){
    for(let j = 0; j < 3; j++){
      if(!LIST[i][j]){
        let temp = clone(LIST);
        temp[i][j] = color;
        if(check(temp, color)){              
          return [j, i];
        }
      }
    }
  }
  return null;
}

function check(LIST, color){

  for(let i = 0; i<3;i++){
    let win = true;
    for(let j = 0; j< 3; j++){
      if(LIST[i][j] !== color){
        win = false;
        break;
      }
    }
    if(win) return true;
  }

  for(let i = 0; i<3;i++){
    let win = true;
    for(let j = 0; j< 3; j++){
      if(LIST[j][i] !== color){
        win = false;
        break;
      }
    }
    if(win) return true;
  }

  {
    let win = true;
    for(let i = 0; i<3;i++){
      if(LIST[i][i] !== color){
        win = false;
      }
    }
    if(win) return true;
  }

  {
    let win = true;
    for(let i = 0; i<3;i++){
      if(LIST[i][2- i] !== color){
        win = false;
      }
    }
    if(win) return true;
  }
  return false;
}

function clone(LIST){
  return JSON.parse(JSON.stringify(LIST));
}

function bestChoice(LIST, color){
  let point = willWin(LIST, color);
  if(point){
   return {
         point: point,
         result: 1
       }
  }
  let result = -1;
  outer:for(let i = 0; i<3; i++){
    for(let j = 0; j< 3; j++){
      if(LIST[i][j] === 0){
        let temp = clone(LIST);
        temp[i][j] = color;
        let opp = bestChoice(temp, 3 - color);
        console.log(opp.result, result)
        if( -opp.result >= result){
            point = [j, i];
            result = - opp.result;
        }
        if(result == 1){
          break outer;
        }
      }
    }
  }
  return {
    point: point,
    result: point? result : 0
  }
}

draw();
