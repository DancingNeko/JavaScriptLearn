let minute = 0;
let second = 0;
let centisecond = 0;
let hue = 0;
document.body.style.fontSize = "xx-large"
function castNumber(num)
{
    return (num<10) ? ("0"+num):num;
}

setInterval(() => {
    hue++;
    centisecond++;
    if(second == 60){
        minute++;
        second = 0;
    }
    if(centisecond == 100)
    {
        second ++;
        centisecond = 0;
    }
    if(hue == 360)
        hue = 0;
    document.body.innerHTML = (`${castNumber(minute)}:${castNumber(second)}:${castNumber(centisecond)} elapsed`); 
    document.body.style.backgroundColor = `hsl(${hue}, 100%, 90%)`
    document.body.style.color = `hsl(${360-hue}, 100%, 40%)`
}, 10);
