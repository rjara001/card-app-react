import { IWord } from "../interfaces/IWord.js";

export class Word implements IWord {
     name: string;
     value: string;
     cycles: number;
     isKnowed: boolean;
     reveled: boolean;

     constructor(name:string, value:string) {
        this.name = name
        this.value = value
        this.cycles = 0;
        this.isKnowed = false;
        this.reveled = false;
     }
    
     static newWord():IWord {
        return {name:'', value:'', cycles:0, isKnowed:false, reveled:false}
     }
}