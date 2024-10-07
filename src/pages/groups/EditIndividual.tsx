import { Divider } from "@mui/material"
import { IndividualEdit } from "./IIndividualProps"
import { WordList } from "../../components/WordList"
import { IWord } from "../../interfaces/IWord"
import { useState } from "react"
import { IUserInfo } from "../../interfaces/IUserInfo"
import { filterWordByWord } from "../../util/util"

type EditIndividualType = {
    word: IWord
    filter: string
    handleSaveClick: (word:IWord)=>void
    words: IWord[]
    handleDeleteWord: (word:IWord)=> void
    userInfo: IUserInfo
    handleSelectedItem: (item:IWord)=>void
    handleEditWord: (word:IWord)=>void
}

export const EditIndividual : React.FC<EditIndividualType> = ({word, userInfo, words, filter, handleSaveClick, handleDeleteWord, handleEditWord, handleSelectedItem}) => {
    const [filterWord, setFilterWord] = useState(filter);

    const handleWorldChanged = (value:string, type:string)=> {
      
        setFilterWord(value);
    }
    const doFilter = (word:IWord)=> {
        if (filterWord.length>0)
            return filterWordByWord(word.Name, filterWord) || filterWordByWord(word.Value, filterWord)
        else
            return true;
    }


    return <>

        <IndividualEdit userInfo={userInfo}  word={word} filter={filterWord} handleSaveClick={handleSaveClick} handleWorldChanged={handleWorldChanged}></IndividualEdit>
        <Divider></Divider>
        <WordList words={words.filter(_=> doFilter(_))} 
                onHandleClickDeleteItem={handleDeleteWord} 
                handleClickEditItem={handleEditWord} 
                handleSelectedItem={handleSelectedItem}></WordList></>
}