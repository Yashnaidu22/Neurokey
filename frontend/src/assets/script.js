class analyzer{
    constructor(){
        this.setUpEventListener();
    }
    setUpEventListener(){
        const inputField = document.getElementById("inputField");
        inputField.addEventListener("keydown",(event)=>{
            this.handleKeydown(event);
        });
        inputField.addEventListener("keyup",(event)=>{
            this.handleKeyup(event);
        });
    }
    handleKeydown(event){
        console.log("Key down event detected");
    }
    handleKeyup(event){
        console.log("Key up event detected");
    }
}
const obj = new analyzer();
