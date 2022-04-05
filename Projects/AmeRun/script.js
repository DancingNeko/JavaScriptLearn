let canvas = document.getElementsByClassName("Canvas")[0];
let ctx = canvas.getContext("2d");
ctx.canvas.width = window.innerWidth; // huge thanks to devyn's answer to canvas resizing under the post:
ctx.canvas.height = window.innerHeight; // https://stackoverflow.com/questions/1664785/resize-html5-canvas-to-fit-window/3078427#3078427
let interval = 17; // ~60fps
const SCREEN_WIDTH = canvas.width;
const SCREEN_HEIGHT = canvas.height;
const SNOW_AMOUNT = 100;
document.body.style.backgroundColor = "rgb(0,0,0)"
ctx.fillStyle = "rgb(255,255,255)";
ticks = 0;
frameCount = 0;
ticksIncrement = 1;
gameOver = false;
restartPermitted = false;
gameStart = false;
endTick = -1;
restart = false;

lowFrameRate = false;

function ticksUpdate(){
    frameCount++;
    ticks += ticksIncrement;
    return parseInt(ticks);
}

function gameOverAnimation(){
    if(!restart){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.drawImage(bg,ctx.drawImage(bg,-1*Math.abs(endTick%100-50),0),0); // draw background
        
        //draw score
        ctx.font = "30px Verdana";
        ctx.fillStyle = "rgb(255,255,255)"
        ctx.fillText(String(parseInt(endTick/60)).padStart(5, '0'), SCREEN_WIDTH - 150, parseInt(0.1*SCREEN_HEIGHT));

        env.draw();
        chibi.update();
        chibi.draw();
        snowflakes.forEach(item => {
            item.draw();
        });
        ctx.globalAlpha = Math.abs(ticks%100-50)/50;
        ctx.drawImage(gameOverImg, parseInt(SCREEN_WIDTH/2-275), parseInt(SCREEN_HEIGHT/2-210));
        ctx.globalAlpha = 1;
        ticksUpdate();
        setTimeout(gameOverAnimation,interval);
    }
    else{
        restart = false;
    }
}

function redraw(){
    if(!gameOver){
    ctx.clearRect(0,0,canvas.width,canvas.height);


    // draw graphics
    ctx.drawImage(bg,-1*Math.abs(ticks%100-50),0);
    env.update();
    env.draw();
    chibi.update();
    chibi.draw();
    snowflakes.forEach(item => {
        item.move();
        item.draw();
    });
    // end draw

    //draw score
    ctx.font = "30px Verdana";
    ctx.fillStyle = "rgb(255,255,255)"
    ctx.fillText(String(parseInt(ticks/60)).padStart(5, '0'), SCREEN_WIDTH - 150, parseInt(0.05*SCREEN_HEIGHT));

    ticksUpdate();
    setTimeout(redraw, interval);
    }
    else{
    endTick = ticks;
    chibi.jumpAction(); // chibi drop when game ends
    setTimeout(gameOverAnimation, interval);
    }
}


class Player{
    constructor(){
        this.dropDistance = 0; // indicator of drop state, number represent drop height
        this.dropStart = 0; // start tick of drop
        this.dropFrame = -1; // drop animation frame
        this.jump = 0;
        this.height = 0;
        this.over = 0;
    }
    update(){
        if(gameOver)
            this.jump++;
        else
            this.jump-=parseInt(ticksIncrement);
    }
    draw(){
        if(gameOver){ // animation of game over
            if(this.over==100)
                this.pre_height = this.height;
            this.height = Math.pow((0.8*this.jump - 14), 2) * (-1) + 196 + this.pre_height;
            ctx.drawImage(character[parseInt(frameCount/parseInt(80/interval))%7], parseInt(Math.max(SCREEN_WIDTH/5,123)), SCREEN_HEIGHT-153-parseInt(this.height)-env.elevation);
            this.over--; 
        }
        if(this.dropDistance > 0){ // in ground pound/drop state
            if(this.dropStart == 5){ // end of animation
                this.dropDistance = 0;
                this.dropStart = 0;
                this.dropFrame = 5;
                ctx.drawImage(character[parseInt(frameCount/parseInt(80/interval))%7], parseInt(Math.max(SCREEN_WIDTH/5,123)), SCREEN_HEIGHT-153-env.elevation);
                return;
            }
            this.height = this.dropDistance/5*(5-this.dropStart);
            this.dropStart++;
            ctx.drawImage(character[parseInt(frameCount/parseInt(80/interval))%7], parseInt(Math.max(SCREEN_WIDTH/5,123)), SCREEN_HEIGHT-153-env.elevation-parseInt(this.height));
        }
        else if(this.jump <= 0){ // not in jumping
            this.height = 0;
            if(this.dropFrame != -1){ // drop animation
                if(this.dropFrame == 5)
                    dropSE.play();
                ctx.drawImage(dropImg[this.dropFrame], parseInt(Math.max(SCREEN_WIDTH/5,123)), SCREEN_HEIGHT-153-env.elevation);
                if(frameCount%3 == 0)
                this.dropFrame++;
                if(this.dropFrame == 10)
                    this.dropFrame = -1;
            }
            else
                ctx.drawImage(character[parseInt(frameCount/parseInt(80/interval))%7], parseInt(Math.max(SCREEN_WIDTH/5,123)), SCREEN_HEIGHT-153-env.elevation);
        }
        else{ // jumping
            this.height = Math.pow((0.5*this.jump - 14), 2) * (-1) + 200; // formula for jumping curve
            if(this.dropFrame != -1){ // drop animation
                if(this.dropFrame == 5)
                    dropSE.play();
                ctx.drawImage(dropImg[this.dropFrame], parseInt(Math.max(SCREEN_WIDTH/5,123)), SCREEN_HEIGHT-153-env.elevation);
                this.dropFrame++;
                if(this.dropFrame == 10)
                    this.dropFrame = -1;
            }
            else
                ctx.drawImage(character[parseInt(frameCount/parseInt(80/interval))%7], parseInt(Math.max(SCREEN_WIDTH/5,123)), SCREEN_HEIGHT-153-parseInt(this.height)-env.elevation);
        }
    }
    jumpAction(){
        this.jump = 56;
        if(gameOver)
            this.jump = 0;
    }
    dropAnimation(){
        this.jump = 0;
        this.dropDistance = this.height;
        this.dropStart = 0;
    }
}

class SnowFlakes{
    constructor(){
        this.ticks = parseInt(Math.random()*30*(1000/interval)); //randomize 30 sec animation variation
        this.speed = Math.random()*0.25+0.5;
        this.x = Math.random()*SCREEN_WIDTH;
        this.y = 0;
        this.opacity = Math.random()*0.25+0.4;
        this.size = parseInt(SCREEN_WIDTH/200); // radius of snow
    }
    draw(){
        let cur_y = this.y + this.ticks*this.speed; // current x
        let cur_x = this.x + Math.sin(cur_y/SCREEN_WIDTH)*Math.cos(cur_y/SCREEN_WIDTH)*Math.log(cur_y/SCREEN_WIDTH)*SCREEN_WIDTH; // current y
        cur_x = (parseInt(cur_x) % (SCREEN_WIDTH) + SCREEN_WIDTH) % SCREEN_WIDTH;
        cur_y = (parseInt(cur_y) % (SCREEN_HEIGHT) + SCREEN_HEIGHT) % SCREEN_HEIGHT;
        for(let i = 0; i < this.size; i++){
            ctx.fillStyle = `rgba(255,255,255,${this.opacity/this.size - Math.abs(this.ticks%200-100)/1000})`;
            ctx.beginPath();
            ctx.arc(cur_x, cur_y, i*2, 0, 2 * Math.PI);
            ctx.fill();
        } 
    }
    move(){
        this.ticks++;
    }
}

class Environment{
    constructor(){
        this.groundHeight = 50;
        this.obstacles = [];
        this.obstableWidth = parseInt(Math.random()*30+20);
        this.obstaclePassed = 0;
        this.speed = 5;
        this.nextObject = parseInt(Math.random()*70+50); // next object distance
        this.elevation = 0;
        this.targetElevation = parseInt(Math.random()*SCREEN_HEIGHT*0.25);
        this.elevateUp = true;
    }
    update(){
        this.nextObject-=parseInt(ticksIncrement);
        for(let i =0; i < this.obstacles.length; i++){
            let item = this.obstacles[i];
            if(item[0] <= -1*item[2]){ // check if obstacle move out of screen, if so remove from list
                this.obstacles.splice(i,1);
                i--;
                this.obstaclePassed++;
                if(this.obstaclePassed <= 100)
                    ticksIncrement *= 1.01;
                continue;
            }

            if(Math.abs(item[0] + item[2]/2 - parseInt(Math.max(SCREEN_WIDTH/5,123)) - 61.5) < 35 + item[2]/2){ // collision check,, 61.5 is half size of character, 60 is character width

                if(chibi.height+10 <= item[1]){
                    gameOver = true;
                    bgm.pause();
                    gameOverSE.play();
                }
            }
            item[0]-=this.speed*parseInt(ticksIncrement); // move object x position
        }
        if(this.nextObject<=0){ // create new obstacle
            this.obstacles.push([SCREEN_WIDTH,parseInt(Math.random()*90+30),this.obstableWidth]); // min height 30 max height 120
            this.nextObject = parseInt(Math.random()*70+50);
            this.obstableWidth = parseInt(Math.random()*30+20);
        }
        // update elevation of ground
        if(this.elevation < this.targetElevation && this.elevateUp)
            this.elevation+=parseInt(2*ticksIncrement);
        else if(this.elevateUp){
            this.elevateUp = false;
        }
        else if(!this.elevateUp && this.elevation > 0)
            this.elevation-=parseInt(2*ticksIncrement);
        else if(!this.elevateUp && this.elevation == 0){
            this.elevateUp = true;
            this.targetElevation = parseInt(Math.random()*SCREEN_HEIGHT*0.25);
        }
    }
    draw(){
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.fillRect(0,SCREEN_HEIGHT-this.groundHeight-this.elevation ,SCREEN_WIDTH,this.groundHeight + this.elevation);
        this.obstacles.forEach(item => {
            ctx.fillRect(item[0],SCREEN_HEIGHT-item[1]-this.groundHeight - this.elevation,item[2],item[1]);
        });
    }
}

function interact(){
    if(gameOver){
        if(restartPermitted)
            initiation();
    }
    else if(!gameStart){
        bgm.play();
        gameStart = true;
        setTimeout(redraw, interval);
    }
    else if(chibi.jump >= 10 && chibi.dropDistance == 0){ // drop animation
        chibi.dropAnimation();
    }
    else if(chibi.jump <= 0){ // normal jump
        let dupeAudio = jumpSE.cloneNode();
        dupeAudio.volume = 0.5;
        dupeAudio.play();
        chibi.jumpAction();
    }
}

function initiation(){
    env = new Environment();
    chibi = new Player();
    chibi.jumpAction.bind(chibi);
    bgm.currentTime = 0;
    ticks = 0;
    if(lowFrameRate){
    interval = 33;
    ticksIncrement = 2;
    }
    else{
    interval = 16;
    ticksIncrement = 1;
    }
    restart = true;
    gameStart = false;
    gameOver = false;
    restartPermitted = false;
    interact();
}

// initialize everything
snowflakes = [];
for(let i = 0; i < SNOW_AMOUNT; i++){
    snowflakes.push(new SnowFlakes);
}
var bg = new Image();
bg.onload = ()=>{
    console.log("Background loaded!");
}
bg.src = "./bg.jpg"
character = [];
for(let i = 0; i < 7; i++){
    var temp = new Image();
    temp.onload = ()=>{
        console.log(`${i+1} image loaded!`);
    }
    temp.src = `./character/${i+1}.png`;
    character.push(temp);
}
chibi = new Player();
chibi.jumpAction.bind(chibi);
canvas.onmousedown = ()=>{interact();};
document.addEventListener('keypress', (event) => {
    var key = event.key;
    if(key == ' ')
        interact();
});
env = new Environment();
var gameOverImg = new Image();
gameOverImg.src = "./gameover.png"
var bgm = new Audio("./Klee!.mp3");
bgm.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);
ctx.font = "30px Verdana";
ctx.fillStyle = "rgb(255,255,255)";
ctx.fillText("Space/Click to jump", parseInt(0.1*SCREEN_WIDTH), parseInt(0.4*SCREEN_HEIGHT));
ctx.fillText("Space/Click on air to ground pound", parseInt(0.1*SCREEN_WIDTH), parseInt(0.5*SCREEN_HEIGHT));
ctx.fillText("Space/Click to start!", parseInt(0.1*SCREEN_WIDTH), parseInt(0.6*SCREEN_HEIGHT));
const frameRateButton = document.getElementById("frameRate");
frameRateButton.onclick = function(){
    this.blur();
    if(lowFrameRate == false){
        this.textContent = "30 fps";
        lowFrameRate = true;
        interval = 33;
        ticksIncrement = 2;
    }
    else{
        this.textContent = "60 fps";
        lowFrameRate = false;
        interval = 17;
        ticksIncrement = 1;
    }
}

var jumpSE = new Audio("./jump.mp3");
var gameOverSE = new Audio("./gameover.mp3");
gameOverSE.onended=()=>{
    restartPermitted = true;
}
let muteButton = document.getElementById("mute");
muteButton.onclick = function(){
    this.blur();
    if(bgm.volume > 0){
        this.textContent = "Music Off"
        bgm.volume = 0;
    }
    else{
        this.textContent = "Music On"
        bgm.volume = 1;
    }
}
muteButton.font = "30px Verdana";
dropImg = [];
for(let i = 0; i < 10; i++){
    var temp = new Image();
    temp.onload = ()=>{
        console.log(`d${i+1} image loaded!`);
    }
    temp.src = `./character/d${i+1}.png`;
    dropImg.push(temp);
}
var dropSE = new Audio("./groundpound.mp3");
// intiazation ends

