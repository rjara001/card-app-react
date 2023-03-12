import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, createContext, useContext } from "react";
import { PlayContext } from "../../context/context.create";

import { queryGroupEdit } from "../../hooks/group.hook";
import { IGroup } from "../../interfaces/IGroup";
import { ISummary, ISummaryContext } from "../../interfaces/ISummary";
import { IWord } from "../../interfaces/IWord";
import { Word } from "../../models/Word";
import { countSummary } from "../../util/util";
import { Play } from "./Play";

const getRandomArbitrary = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min) + min);
}

const nextValue = (words: IWord[], setWord: (word: IWord) => void) => {

    let wordsFilterd = words.filter(_=>!_.isKnowed && !_.reveled)
    let arbitraryIndex = getRandomArbitrary(0, wordsFilterd.length);
    let nextElement = words[arbitraryIndex];
    nextElement.cycles++;

    setWord(nextElement);
}

const correct = (word: IWord, setWord: any) =>{

    setWord((prev: IWord) => {
        let newObj: IWord = { ...prev, isKnowed: true };

        return newObj;
    });

}

export const PlaySpace = () => {
    const {summary, updateValue} = useContext(PlayContext);
    
    const revel = (word: IWord, setWord: any) => {


        word.reveled = true;
        setWord((prev: IWord) => {
            let newObj: IWord = { ...prev, reveled:true };
    
            return newObj;
        });

        setGetResult((prev:IGroup)=>{
            let newObj: IGroup = { ...prev, words: [...prev.words, word] };
    
            return newObj;
        });
    
        let newValue = countSummary(result);
        updateValue(newValue);

    }
    const group = 1;

    const [result, setGetResult] = useState<IGroup>({ name: '', words: [] });
    const [word, setWord] = useState<IWord>(Word.newWord());

    const getData = async () => {
        const { data } = await queryGroupEdit();
        let group = data as IGroup;
        group.words = group.words.map(_ => new Word(_.name, _.value));
        setGetResult(group);

    };

    useEffect(() => {
        if (result.words.length === 0)
            return;

        nextValue(result.words, setWord);


    }, [result])
    useEffect(() => {
        getData();


    }, []);

    return <div>

        <div>
            <Play word={word}
                next={() => nextValue(result.words, setWord)}
                revel={() => revel(word, setWord)}
                correct={() => {correct(word, setWord);nextValue(result.words, setWord);}}

            ></Play>
        </div>
    </div>


}