
document.body.style.backgroundColor = "rgb(0,0,0)";
let canvas = document.getElementById("draw");
let ctx = canvas.getContext("2d");
tick = 0; // record setInterval ticks
circles = [];
chaosOn = false;
snowOn = false;
snowflakes = 100;
snowSlider = document.getElementById("snowSlider");

snowSlider.oninput = function(){
    snowflakes = this.value;
}

function paint(){
    tick++;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    if(chaosOn)
        chaos();
    if(snowOn){
        for(let i = 0; i < snowflakes; i++){
            circles[i].draw();
        }
    }
}


function prepareCircle(num) {
    for(let i = 0; i < num; i++){
        circles.push(new glowCircle(parseInt(Math.random()*400),parseInt(Math.random()*canvas.width),parseInt(Math.random()*canvas.height)));
    }
}

class glowCircle{
    constructor(shift,x,y){
        this.shift = shift;
        this.x = x;
        this.y = y;
        console.log(shift);
    }
    draw() {   
        let size = Math.abs((tick+this.shift)%40-20); // shift back and forth between 0 and 10
        for(let i = 0; i < size; i++){
            ctx.fillStyle = "rgba(255,255,255,0.01)";
            ctx.beginPath();
            ctx.arc(this.x, this.y, i*2, 0, 2 * Math.PI);
            ctx.fill();
        } 
    }
}

function chaos(){
    for(let i = 0; i < snowflakes; i++){
    ctx.fillStyle = `hsl(${parseInt(Math.random()*360)}, 100%, 40%)`;
    ctx.fillRect(parseInt(Math.random()*canvas.width),parseInt(Math.random()*canvas.height),parseInt(Math.random()*60),parseInt(Math.random()*60));
    }
}

function chaosSwitch(){
    chaosOn = !chaosOn;
}

function circleSwitch(){
    snowOn = !snowOn;
}






prepareCircle(500);
setInterval(paint, 100);