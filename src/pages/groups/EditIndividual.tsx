import { Divider } from "@mui/material"
import { IndividualEdit } from "./IIndividualProps"
import { WordList } from "../../components/WordList"
import { IWord } from "../../interfaces/IWord.js"
import { IGroup } from "../../interfaces/IGroup.js"
import { useState } from "react"
import { IUserInfo } from "../../interfaces/IUserInfo"
import { filterWordByType } from "../../util/util"


type EditIndividualType = {
    word: IWord
    filter: string
    handleSaveClick: (word:IWord)=>void
    words: IWord[]
    handleDeleteWord: (word:IWord)=> void
    userInfo: IUserInfo
    handleSelectedItem: (item:IWord)=>void
}

export const EditIndividual : React.FC<EditIndividualType> = ({word, userInfo, words, filter, handleSaveClick, handleDeleteWord, handleSelectedItem}) => {
    const [filterWord, setFilterWord] = useState(filter);
    const [type, setType] = useState(userInfo.FirstShowed?'Name':'Value');

    const handleWorldChanged = (value:string, type:string)=> {
      
        setFilterWord(value);
        setType(type);
    }
    const doFilter = (word:IWord)=> {
        return filterWordByType(type, word, filterWord);
    }


    return <>

        <IndividualEdit userInfo={userInfo}  word={word} filter={filterWord} handleSaveClick={handleSaveClick} handleWorldChanged={handleWorldChanged}></IndividualEdit>
        <Divider></Divider>
        <WordList words={words.filter(_=> doFilter(_))} onHandleClickDeleteItem={handleDeleteWord} handleSelectedItem={handleSelectedItem}></WordList></>
}