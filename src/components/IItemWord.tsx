import { IWord } from "../interfaces/IWord";

export interface IItemWord {
    word: IWord
    handleClickDeteleItem: (word:IWord)=> void
}