import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, createContext, useContext } from "react";
import { GlobalSummary } from "../../components/GlobalSummary";
import { PlayContext } from "../../context/context.create";

import { queryGroupEdit } from "../../hooks/group.hook";
import { IGroup } from "../../interfaces/IGroup";
import { ISummary, ISummaryContext } from "../../interfaces/ISummary";
import { IWord } from "../../interfaces/IWord";
import { Word } from "../../models/Word";
import { calculateSummary, countSummary } from "../../util/util";
import { Play } from "./Play";

const getRandomArbitrary = (min: number, max: number, currentIndex: number): number => {
    let index = -1;
    do{
         index = Math.floor(Math.random() * (max - min) + min);
    } while (index==currentIndex && max>1)

    return index;

    
}

export const PlaySpace = () => {
    const { summary, updateValue } = useContext(PlayContext);

    const [result, setGetResult] = useState<IGroup>({ name: '', words: [] });
    const [indexWord, setIndexWord] = useState<number>(-1);
    const [hasChanged, setHasChanged] = useState(true);

    const nextValue = () => {
        setHasChanged(false);

  
        let wordsFilterd = result.words.filter(_ => !_.isKnowed && !_.reveled);
        let arbitraryIndex = getRandomArbitrary(0, wordsFilterd.length, indexWord);

        let nextElement = wordsFilterd[arbitraryIndex];
        nextElement.cycles++;

        arbitraryIndex = result.words.findIndex(_=>_.name === nextElement.name);

        setIndexWord(arbitraryIndex);

        const updateWords = [...result.words];

        updateWords[arbitraryIndex] = nextElement;

        setGetResult({ ...result, words: updateWords });

    }

    const revel = () => {
        const updateWords = [...result.words];

        const item = updateWords[indexWord];

        item.reveled = true;

        updateWords[indexWord] = item;

        setGetResult({ ...result, words: updateWords });
    }
    const correct = () => {

        const updateWords = [...result.words];

        const item = updateWords[indexWord];

        item.isKnowed = true;

        updateWords[indexWord] = item;

        setGetResult({ ...result, words: updateWords });
    
        nextValue();
    }
    const group = 1;

    const getData = async () => {
        const { data } = await queryGroupEdit();
        let group = data as IGroup;
        group.words = group.words.map(_ => new Word(_.name, _.value));
        setGetResult(group);

    };

    useEffect(() => {


        if (result.words.length > 0 && hasChanged)
            nextValue();

        // let newValue = countSummary(result);

        // updateValue(newValue);
    }, [result, hasChanged])

    useEffect(() => {


        if (result.words.length > 0 && hasChanged)
            nextValue();

        let newValue = countSummary(result);

        updateValue(newValue);
    }, [result])

    useEffect(() => {
        getData();


    }, []);


    if (indexWord<0)
        return <div>Loading..</div>
    return <div>

        <div>
            <div>{result.words[indexWord].name}</div>
            <Play word={result.words[indexWord]}
                next={() => nextValue()}
                revel={() => revel()}
                correct={() => { correct();  }}

            ></Play>
            <GlobalSummary value={calculateSummary(result)}></GlobalSummary>

            <div>
                {
                    result.words.map((item, i) => (

                        <div key={i}>{`${item.name} isKnowed:${item.isKnowed} Revealed:${item.reveled}`}</div>

                    ))}
            </div>
        </div>
    </div>


}