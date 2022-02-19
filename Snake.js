mapSize = prompt("Enter map size");

directions = ['north', 'east',  'south', 'west'];

path = [[0,0]];
dir = directions[2]; //current direction
loc = [0,0]; // location on map: [x,y]
objectLoc = [parseInt(Math.random()*mapSize),parseInt(Math.random()*mapSize)];
objectGot = 0;
speed = 100;
turned = false; //reset after every round, prevent 2 keystrokes in single round
speedChanged  = false;


//from https://stackoverflow.com/questions/30097815/javascript-change-line-height-of-body
var style = getComputedStyle(document.body);
if (style.lineHeight.match(/px$/) === null)
{ 
    document.body.style.lineHeight = "1.0em";
}
else
{
    document.body.style.lineHeight = (parseFloat(style.lineHeight) / 16) + (0.4) + "em";
}

function reachObject(){
  if(loc[0] == objectLoc[0] && loc[1] == objectLoc[1]){ //if got the object
    while(collideWithBody(objectLoc) || compareArray(objectLoc, loc))  //prevent spawn on the same location as body & head
      objectLoc = [parseInt(Math.random()*mapSize),parseInt(Math.random()*mapSize)];
    map[objectLoc[1]] = replaceCharAt(map[objectLoc[1]], String.fromCharCode(10084), objectLoc[0]);
    objectGot++;
    return true;
  }
  return false;
}

function compareArray(arr1, arr2){
  for(let i = 0; i < arr1.length; i++)
  {
    if(arr1[i] != arr2[i])
      return false;
  }
  return true;
}

function collideWithBody(position){
  for(let i = 0; i < path.length; i++){
    if(compareArray([position[0],position[1]],path[i]))
      return true;
  }
  return false;
}

function goForward(){
  let x = loc[0];
  let y = loc[1];
  if(dir == 'north' && loc[1] > 0)
    loc[1]--;
  if(dir == 'east' && loc[0] < mapSize - 1)
    loc[0]++;
  if(dir == 'south' && loc[1] < mapSize - 1)
    loc[1]++;
  if(dir == 'west' && loc[0] > 0)
    loc[0]--;
  if(!reachObject()){
    let deleteLoc = path.shift();
    map[deleteLoc[1]] = replaceCharAt(map[deleteLoc[1]], String.fromCharCode(9634), deleteLoc[0])
  }
  if(collideWithBody(loc)){
    return false;
  }
  path.push([loc[0],loc[1]]);
  if(loc[0] == x && loc[1] == y){
    return false;
  }
  return true;
}

function replaceCharAt(str, char, index){ //replace character at index
  return str.substring(0, index) + char + str.substring(index+1);
}

function move(){
  turned = false;
  if(!goForward()){
    confirm(`Game Over! You scored ${objectGot}, speed ${speed}`);
    return false;
  }
  map[loc[1]] = replaceCharAt(map[loc[1]], String.fromCharCode(9608), loc[0])
  speed = Math.floor(1/(0.001*(objectGot + 20))+50); //formula for speed incrememt (smaller faster, capped at 50)
  speedChanged = true;
  return true;
}

//set up default map
map = [];
for(let i = 0; i < mapSize; i++){
  row = ""
  for(let j = 0; j < mapSize; j++){
    row += String.fromCharCode(9634);
  }
  map.push(row)
}
map[objectLoc[1]] = replaceCharAt(map[objectLoc[1]], String.fromCharCode(10084), objectLoc[0]) //setup target

function arryToHTML(){
  result = ""
  for(let i = 0; i <  mapSize; i++){
    result+=map[i] + "<br>";
  }
    return result;
}


document.addEventListener('keypress', (event) => {
    if(turned)
      return; // no response if already turned this interval
    var key = event.key;
    turned = true;
    if(key == 'w' && dir != 'south')
      dir = 'north';
    else if(key == 'd' && dir != 'west')
      dir = 'east';
    else if(key == 's' && dir != 'north')
      dir = 'south';
    else if(key == 'a' && dir != 'east')
      dir = 'west';
    else
      turned = false;
  }, false);


function intervalCall(){
  if(speedChanged){
    speedChanged = false;
    clearInterval(interval);
    interval = setInterval(intervalCall, speed);
  }
  if(!move()){
    clearInterval(interval);
  }
  document.body.innerHTML = (arryToHTML(map));
}

interval = setInterval(intervalCall, speed);