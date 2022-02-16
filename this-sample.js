
function func1() {
    this.xval = 0;
    function func2() {
        this.xval = 5;
    }

    func2();
    console.log(this.xval);
}

func1();

