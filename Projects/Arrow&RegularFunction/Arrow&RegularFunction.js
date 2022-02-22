const myObject = {
        test(){
        console.log(this);
    },
    test1: ()=>{
        console.log(this);
    }
}



myObject.test(); // check the result in the console
myObject.test1();

