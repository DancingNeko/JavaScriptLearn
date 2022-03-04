let canvas = document.getElementsByClassName("Canvas")[0];
let ctx = canvas.getContext("2d");
let interval = 16; // ~60fps
const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;
canvas.width = SCREEN_WIDTH;
canvas.height = SCREEN_HEIGHT;
const SNOW_AMOUNT = 100;
document.body.style.backgroundColor = "rgb(0,0,0)"
ctx.fillStyle = "rgb(255,255,255)";
ticks = 0;
gameOver = false;
gameStart = false;

function gameOverAnimation(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(bg,0,0);
    env.draw();
    chibi.update();
    chibi.draw();
    snowflakes.forEach(item => {
        item.draw();
    });
    ctx.globalAlpha = Math.abs(ticks%100-50)/50;
    ctx.drawImage(gameOverImg, parseInt(SCREEN_WIDTH/2-275), parseInt(SCREEN_HEIGHT/2-210));
    ctx.globalAlpha = 1;
    ticks++;
    setTimeout(gameOverAnimation,16);
}

function redraw(){
    if(!gameOver){
    ctx.clearRect(0,0,canvas.width,canvas.height);



    ctx.drawImage(bg,0,0);
    env.update();
    env.draw();
    chibi.update();
    chibi.draw();
    snowflakes.forEach(item => {
        item.move();
        item.draw();
    });
    


    ticks++;
    setTimeout(redraw, interval);
    }
    else{
    chibi.jumpAction();
    setTimeout(gameOverAnimation, 16);
    }
}


class Player{
    constructor(){
        this.jump = 0;
        this.height = 0;
        this.over = 0;
    }
    update(){
        if(gameOver)
            this.jump++;
        else
            this.jump--;
    }
    draw(){
        if(gameOver){
            if(this.over==100)
                this.pre_height = this.height;
            this.height = Math.pow((0.8*this.jump - 14), 2) * (-1) + 196 + this.pre_height;
            ctx.drawImage(character[parseInt(ticks/10)%7], parseInt(Math.max(SCREEN_WIDTH/5,123)), SCREEN_HEIGHT-123-parseInt(this.height)-30);
            this.over--; 
        }
        if(this.jump <= 0){ // not in jumping
            this.height = 0;
            ctx.drawImage(character[parseInt(ticks/10)%7], parseInt(Math.max(SCREEN_WIDTH/5,123)), SCREEN_HEIGHT-153);
        }
        else{ // jumping
            this.height = Math.pow((0.5*this.jump - 14), 2) * (-1) + 200;
            ctx.drawImage(character[parseInt(ticks/10)%7], parseInt(Math.max(SCREEN_WIDTH/5,123)), SCREEN_HEIGHT-123-parseInt(this.height)-30);
        }
    }
    jumpAction(){
        this.jump = 56;
        if(gameOver)
            this.jump = 0;
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
        this.obstableWidth = 50;
        this.obstaclePassed = 0;
        this.speed = 5;
        this.nextObject = parseInt(Math.random()*70+120);
    }
    update(){
        this.nextObject--;
        for(let i =0; i < this.obstacles.length; i++){
            let item = this.obstacles[i];
            if(item[0] <= -1*this.obstableWidth){ // check if obstacle move out of screen, if so remove from list
                this.obstacles.splice(i,1);
                i--;
                this.obstaclePassed++;
                if(this.obstaclePassed <= 5)
                    interval = 16;
                else if(this.obstaclePassed <= 40)
                    interval = parseInt(16-this.obstaclePassed*0.3);
                else
                    interval = 2;
                continue;
            }
            if(Math.abs(item[0] + this.obstableWidth/2 - parseInt(Math.max(SCREEN_WIDTH/5,123)) - 61.5) < 60){ // collision check
                if(chibi.height+10 <= item[1]){
                    gameOver = true;
                    audio.pause();
                    gameOverSE.play();
                }
            }
            item[0]-=this.speed; // move object x position
        }
        if(this.nextObject<=0){
            this.obstacles.push([SCREEN_WIDTH,parseInt(Math.random()*50+30)]);
            this.nextObject = parseInt(Math.random()*70+120);
        }
    }
    draw(){
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.fillRect(0,SCREEN_HEIGHT-this.groundHeight,SCREEN_WIDTH,this.groundHeight)
        this.obstacles.forEach(item => {
            ctx.fillRect(item[0],SCREEN_HEIGHT-item[1]-this.groundHeight,this.obstableWidth,item[1]);
        });
    }
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
document.addEventListener('click', (event) => {
    if(!gameStart){
        audio.play();
        gameStart = true;
        setTimeout(redraw, interval);
    }
    else{
        chibi.jumpAction();
        jumpSE.play();
    }
},false);
env = new Environment();
var gameOverImg = new Image();
gameOverImg.src = "./gameover.png"
var audio = new Audio("./Klee!.mp3");
audio.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);
startImg = new Image();
startImg.src = "./start.png";
startImg.onload = ()=>{
    ctx.drawImage(startImg,parseInt(Math.abs(417.5-SCREEN_WIDTH/2)),parseInt(417.5-SCREEN_HEIGHT/2));
}
var jumpSE = new Audio("./jump.mp3");
var gameOverSE = new Audio("./gameover.mp3");
// intiazation ends

