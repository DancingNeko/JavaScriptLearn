Game = {
    number: 0,
    guess: -999,
    play: function() {
        max = prompt('How big do you want?')
        this.number = parseInt(Math.random()*max);
        while(this.guess != this.number){
            this.guess = prompt("Guess what number I'm thinking of");
            if(this.guess > this.number)
                alert(`Number too big: ${this.guess}`)
            else if(this.guess < this.number)
                alert(`Number too small: ${this.guess}`)
            else if(this.guess == this.number)
                alert("Congratulations! You win the game!")
            else
                alert('invalid input')
        }
    }
};

Game.play();
console.log(Game.number);