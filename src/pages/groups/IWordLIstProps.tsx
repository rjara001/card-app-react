import { IWord } from "../../interfaces/IWord.js";

export interface IWordListProps {
    words: IWord[]
    onHandleClickDeleteItem: (word:IWord)=> void
}