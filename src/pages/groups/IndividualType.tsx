import { IWord } from "../../interfaces/IWord.js";

export interface IIndividualProps {
    word: IWord
    handleSaveClick: (word:IWord)=>void
}