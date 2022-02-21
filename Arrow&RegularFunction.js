const myObject = {
        test(){
        console.log(this);
    },
    test1: ()=>{
        console.log(this);
    }
}



myObject.test();
myObject.test1();

