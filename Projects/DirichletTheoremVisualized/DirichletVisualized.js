modNumber = prompt("Enter the number you wanna take mod of (<30 recommended)");
slider = document.getElementById("slider");
label = document.getElementById("primeIndicator");
let pList = [];
xLabels = [];
yValues = [];
timeout = 1000;
paused = false;

slider.oninput = function(){
    if(this.value!="0"){
        timeout = parseInt(1000/this.value);
        paused = false;
    }
    else
        paused = true;
}

function checkPrime(num){
    for(let i = 2; i <= Math.sqrt(num); i++){
        if(num % i == 0)
            return false;
    }
    return true;
}

function drawChart(){
    new Chart("primeChart",{
        type: "bar",
        data:{
            labels: xLabels,
            datasets:[{
                backgroundColor: "black",
                data: yValues
            }]
        },
        options:{
            events: [],
            animation: false,
            legend: {display: false},
            title:{
                display: true,
                text: `Number of prime mod ${modNumber} equals x`
            }
        }
    })
}

function findPrime(){ // push the next prime into the primeList and return the prime
    this.n = 1;
    this.frontChecked = false;
    this.backChecked = false;
    this.nextPrime = function (primeList){
        if(pList.length == 0) // Sorry for hard coding, being lazy
        {
            primeList.push(2);
            return 2;
        }
        if(pList.length == 1)
        {
            primeList.push(3);
            return 3;
        } // end of hard coding
        if(checkPrime(6*this.n-1) && !this.frontChecked){ // prime only occurs at 6n+1 & 6n-1, where n is integer
            primeList.push(6*this.n-1);
            this.frontChecked = true;
            return primeList[primeList.length-1];
        }
        else if(checkPrime(6*this.n+1) && !this.backChecked){
            primeList.push(6*this.n+1);
            this.backChecked = true;
            return primeList[primeList.length-1];
        }
        else{
            this.n++;
            this.frontChecked = false;
            this.backChecked = false; //reset
            return this.nextPrime(primeList);
        }
    }
}


function run() {
    if(!paused){
        let temp = primeFinder.nextPrime(pList);
        yValues[temp%modNumber]++;
        drawChart();
        label.innerHTML = `${temp} mod ${modNumber} equals ${temp%modNumber}`;
    }
    setTimeout(run, timeout);
}

//function declaration ends

for(let i = 0; i < modNumber; i++){ //initialize labels and y datas
    xLabels.push(i);
    yValues.push(0);
}
primeFinder = new findPrime();
setTimeout(run, timeout);

