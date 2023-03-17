import { IWord } from "../interfaces/IWord.js";

export class Word implements IWord {
     Name: string;
     Value: string;
     Cycles: number;
     IsKnowed: boolean;
     Reveled: boolean;

     constructor(name:string, value:string) {
        this.Name = name
        this.Value = value
        this.Cycles = 0;
        this.IsKnowed = false;
        this.Reveled = false;
     }
    
     static newWord():IWord {
        return {Name:'', Value:'', Cycles:0, IsKnowed:false, Reveled:false}
     }
}