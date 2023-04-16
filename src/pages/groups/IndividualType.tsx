import { IUserInfo } from "../../interfaces/IUserInfo";
import { IWord } from "../../interfaces/IWord";

export interface IIndividualProps {
    word: IWord
    handleSaveClick: (word:IWord)=>void
    filter:string
    handleWorldChanged: (value:string, type:string)=>void
    userInfo: IUserInfo
}