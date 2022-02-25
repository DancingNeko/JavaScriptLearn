let primeList = [2,3];


function checkPrime(num){
    for(let i = 2; i <= Math.sqrt(num); i++){
        if(num % i == 0)
            return false;
    }
    return true;
}

function findPrime(){
    this.n = 1;
    this.frontChecked = false;
    this.backChecked = false;
    this.nextPrime = function (){
        if(checkPrime(6*this.n-1) && !this.frontChecked){
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
            return this.nextPrime();
        }
    }
}

primeFinder = new findPrime();

function run() {
    console.log(primeFinder.nextPrime());
}

setInterval(run, 100);

