import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GlobalSummary } from "../../components/GlobalSummary";
import { PlayContext, UserContext } from "../../context/context.create";

import { queryGroupEdit, queryGroupEdit2 } from "../../hooks/group.hook";
import { IGroup } from "../../interfaces/IGroup";
import { IUserInfo } from "../../interfaces/IUserInfo";
import { Word } from "../../models/Word";
import { calculateSummary, countSummary, groupDefault } from "../../util/util";
import { Play } from "../../components/Play";
import Title from "../../molecule/Title";
import Subtitle from "../../molecule/SubTitle";
import Button from "@mui/material/Button";
import RefreshIcon from '@mui/icons-material/Refresh';
import Box from "@mui/material/Box";

const getRandomArbitrary = (min: number, max: number, currentIndex: number): number => {
    let index = -1;
    do {
        index = Math.floor(Math.random() * (max - min) + min);
    } while (index == currentIndex && max > 1)

    return index;
}

export const PlaySpace = () => {

    const { userInfo } = useContext(UserContext);
    const { summary, updateValue } = useContext(PlayContext);
    const [result, setGetResult] = useState<IGroup>(groupDefault);
    const [indexWord, setIndexWord] = useState<number>(-1);
    const [hasChanged, setHasChanged] = useState(true);
    const [isEndedCycle, setIsEndedCycle] = useState(false);
    const [isVeryEndedCycle, setIsVeryEndedCycle] = useState(false);
    const [currentCycle, setCurrentCycle] = useState<number>(0);
    // const [globalSummary, setGlobalSummary] = useState<IGlobalSummary>(globalSummaryDefault);
    const navigate = useNavigate();

    const handleRefreshClick = () => {
        const updateWords = [...result.Words];

        updateWords.forEach(_ => {
            _.Reveled = false;
            _.IsKnowed = false;
            _.Cycles = 0;
        })

        setCurrentCycle(0);
        setGetResult({ ...result, Words: updateWords });
        setIsVeryEndedCycle(false);
    }

    const nextValue = () => {
        setHasChanged(false);

        let wordsFilterd = result.Words.filter(_ => !_.IsKnowed && !_.Reveled && _.Cycles == currentCycle);
        let arbitraryIndex = getRandomArbitrary(0, wordsFilterd.length, indexWord);

        let nextElement = wordsFilterd[arbitraryIndex];

        if (nextElement) {
            // nextElement.cycles++;
            arbitraryIndex = result.Words.findIndex(_ => _.Name === nextElement.Name);

            setIndexWord(arbitraryIndex);

            const updateWords = [...result.Words];

            updateWords[arbitraryIndex] = nextElement;

            setGetResult({ ...result, Words: updateWords });
        }
        else {
            if (currentCycle >= 3) {
                setIsVeryEndedCycle(true);
            }
            else {
                const updateWords = [...result.Words];

                updateWords.filter(_ => _.Cycles === currentCycle && !_.IsKnowed).forEach(_ => {
                    _.Reveled = false;
                    _.Cycles++;
                })


                setIsEndedCycle(true);
                setCurrentCycle((prev) => prev = prev + 1);
                setGetResult({ ...result, Words: updateWords });

            }
        }
    }
    const revel = () => {
        const updateWords = [...result.Words];

        const item = updateWords[indexWord];

        item.Reveled = true;

        updateWords[indexWord] = item;

        setGetResult({ ...result, Words: updateWords });
    }
    const correct = () => {

        const updateWords = [...result.Words];

        const item = updateWords[indexWord];

        item.IsKnowed = true;

        updateWords[indexWord] = item;

        setGetResult({ ...result, Words: updateWords });

        nextValue();
    }
    const getData = async () => {
        const { data } = await queryGroupEdit(userInfo.PlayingGroup.toString());
        let group = data as IGroup;
        group.Words = group.Words.map(_ => Word.newWord2(_.Name, _.Value));
        setGetResult(group);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsEndedCycle(false);
        }, 4000);
        return () => clearTimeout(timer);
    }, [isEndedCycle]);

    useEffect(() => {
        if (result.Words.length > 0 && hasChanged)
            nextValue();


    }, [result, hasChanged])

    useEffect(() => {


        if (result.Words.length > 0 && hasChanged || isEndedCycle)
            nextValue();

        updateValue(calculateSummary(result, countSummary(result)));


    }, [result])

    useEffect(() => {

        if (summary.Total > 0 && summary.Total === summary.Learned) {
            setIsEndedCycle(false);
            setIsVeryEndedCycle(true);
        }


    }, [summary]);

    useEffect(() => {

        if (userInfo.PlayingGroup == 0)
            navigate(`/groups`);
        else {
            setCurrentCycle(0);
            getData();
        }



    }, []);

    if (indexWord < 0)
        return <div>Loading..</div>

    return (
        <div>
            <div>
                <Title>Play</Title>
            </div>
            <div>
                <Subtitle>Group "{result.Name}"</Subtitle>
            </div>

            <div>

                <Play word={result.Words[indexWord]}
                    next={() => nextValue()}
                    revel={() => revel()}
                    correct={() => { correct(); }}></Play>
            </div>
            <div>
                <Subtitle>Progress</Subtitle>
            </div>
            <div>
                <GlobalSummary currentCycle={currentCycle} value={summary}></GlobalSummary>

                {/* <div>
                {
                    result.words.map((item, i) => (

                        <div key={i}>{`${item.name} isKnowed:${item.isKnowed} Revealed:${item.reveled}`}</div>

                    ))}
            </div> */}
            </div>
            <div>
                {
                    isEndedCycle &&
                    <Alert severity="info">
                        <AlertTitle>God Job!</AlertTitle>
                        You have came at the end — <strong>keep it up!</strong>

                    </Alert>}
                {
                    isVeryEndedCycle &&
                    <Alert severity="success">
                        <AlertTitle>Great Gig!, you learned {summary.Learned} and attain an {Math.ceil(summary.Learned/summary.Total*100)} of progress</AlertTitle>
                        <strong>You have finalized!</strong>

                        <Box>
                            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={handleRefreshClick}>
                                Restart
                            </Button>
                        </Box>

                    </Alert>}
            </div>
        </div>)


}