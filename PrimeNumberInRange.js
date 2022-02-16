min = parseInt(prompt('Enter lower bound'));
max = parseInt(prompt('Enter upper bound'));
function checkPrime(num){
    for(let i = 2; i <= Math.sqrt(num); i++){
        if(num%i == 0)
            return false;
    }
    return true
}


function primeInRange(min, max){
    result = `All the prime numbers in range [${min},${max}] are: <br>`

    for(let i = min; i <= max; i++){
        if(checkPrime(i))
            result += i + "<br>";
    }

    return result;
}

result = primeInRange(min, max)
document.write(result)
