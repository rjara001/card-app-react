import { IWord } from "../interfaces/IWord.js";

export class Word implements IWord {

     Name: string;
     Value: string;
     Cycles: number;
     IsKnowed: boolean;
     Reveled: boolean;

     constructor(name:string, value:string, cycles:number, isKnowed:boolean, reveled: boolean) {
        this.Name = name
        this.Value = value
        this.Cycles = cycles;
        this.IsKnowed = isKnowed;
        this.Reveled = reveled;
     }

     static newWord(word:IWord): IWord {
         return new Word(word.Name, word.Value, word.Cycles, word.IsKnowed, word.Reveled);
     }
    
     static newWord2(name:string, value:string): IWord {
      return new Word(name, value, 0, false, false);
  }
 

   //   static newWord():IWord {
   //      return {Name:'', Value:'', Cycles:0, IsKnowed:false, Reveled:false}
   //   }

     getName(FirstShowed:boolean):string {
      if (FirstShowed)
         return this.Name;
      else
         return this.Value
    }
    
    getValue(FirstShowed:boolean):string {
      if (FirstShowed)
         return this.Value;
      else
         return this.Name
    }
}