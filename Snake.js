mapSize = prompt("Enter map size");

directions = ['north', 'east',  'south', 'west'];

path = [[0,0]];
dir = directions[2]; //current direction
loc = [0,0]; // location on map: [x,y]
objectLoc = [parseInt(Math.random()*mapSize),parseInt(Math.random()*mapSize)];
speed = 100;


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
  if(loc[0] == objectLoc[0] && loc[1] == objectLoc[1]){
    while(loc[0] == objectLoc[0] && loc[1] == objectLoc[1]) //prevent spawn on the same location
      objectLoc = [parseInt(Math.random()*mapSize),parseInt(Math.random()*mapSize)];
      map[objectLoc[1]] = replaceCharAt(map[objectLoc[1]], String.fromCharCode(10084), objectLoc[0])
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
  for(let i = 0; i < path.length; i++){
      if(compareArray([loc[0],loc[1]],path[i]))
        return false;
  }
  path.push([loc[0],loc[1]])
  if(loc[0] == x && loc[1] == y){
    return false;
  }
  return true;
}

function replaceCharAt(str, char, index){ //replace character at index
  return str.substring(0, index) + char + str.substring(index+1);
}

function move(){
  if(!goForward()){
    confirm("Game Over!")
    return false;
  }
  if(dir == 'north' || dir == 'south')
  map[loc[1]] = replaceCharAt(map[loc[1]], String.fromCharCode(9608), loc[0])
    else
    map[loc[1]] = replaceCharAt(map[loc[1]], String.fromCharCode(9608), loc[0])
  if(!reachObject()){
    let deleteLoc = path.shift();
    map[deleteLoc[1]] = replaceCharAt(map[deleteLoc[1]], String.fromCharCode(9634), deleteLoc[0])
  }
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
    var key = event.key;
    if(key == 'w' && dir != 'south')
      dir = 'north';
    if(key == 'd' && dir != 'west')
      dir = 'east';
    if(key == 's' && dir != 'north')
      dir = 'south';
    if(key == 'a' && dir != 'east')
      dir = 'west';
  }, false);


interval = setInterval(()=>{
  if(!move()){
    clearInterval(interval);
  }
  document.body.innerHTML = (arryToHTML(map));
}, 100)