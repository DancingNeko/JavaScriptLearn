let canvas = document.getElementsByClassName("Canvas")[0];
let ctx = canvas.getContext("2d");
let interval = 16; // ~60fps
const SCREEN_WIDTH = screen.width;
const SCREEN_HEIGHT = screen.height;
canvas.width = SCREEN_WIDTH;
canvas.height = SCREEN_HEIGHT;
const SNOW_AMOUNT = 100;
document.body.style.backgroundColor = "rgb(0,0,0)"
ctx.fillStyle = "rgb(255,255,255)";


function redraw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    snowflakes.forEach(item => {
        item.move();
        item.draw();
    });

    setTimeout(redraw, interval);
}


class SnowFlakes{
    constructor(){
        this.ticks = parseInt(Math.random()*30*(1000/interval)); //randomize 30 sec animation variation
        this.speed = Math.random()*0.25+0.5;
        this.x = Math.random()*SCREEN_WIDTH;
        this.y = 0;
        this.opacity = Math.random()*0.25+0.4;
        this.size = 5; // radius of snow
    }
    draw(){
        let cur_y = this.y + this.ticks*this.speed; // current x
        let cur_x = this.x + Math.sin(cur_y/SCREEN_WIDTH)*Math.cos(cur_y/SCREEN_WIDTH)*Math.log(cur_y/SCREEN_WIDTH)*SCREEN_WIDTH; // current y
        cur_x = (parseInt(cur_x) % (SCREEN_WIDTH) + SCREEN_WIDTH) % SCREEN_WIDTH;
        cur_y = (parseInt(cur_y) % (SCREEN_HEIGHT) + SCREEN_HEIGHT) % SCREEN_HEIGHT;
        console.log(`x:${cur_x}, y:${cur_y}`);
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

// initialize everything
snowflakes = [];
for(let i = 0; i < SNOW_AMOUNT; i++){
    snowflakes.push(new SnowFlakes);
}




// intiazation ends

setTimeout(redraw, interval);