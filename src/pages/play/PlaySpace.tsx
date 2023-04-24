import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalSummary } from "../../components/GlobalSummary";
import { PlayContext } from "../../context/context.create";
import { IGroup } from "../../interfaces/IGroup";
import { calculateSummary, countSummary, groupDefault, textToSpeech } from "../../util/util";
import { Play } from "../../components/Play/Play";
import Title from "../../molecule/Title";
import Subtitle from "../../molecule/SubTitle";
import Button from "@mui/material/Button";
import RefreshIcon from '@mui/icons-material/Refresh';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import Box from "@mui/material/Box";
import { IWord } from "../../interfaces/IWord";
import { setLocalGroup } from "../../locals/group.local";
import { Adapter } from "../../locals/adapter";
import Header from "../../components/Header";
import ConfirmationDialog from "../../elements/Dialogs/ConfirmationDialog";
import { UserContext } from "../../context/context.user";


const getRandomArbitrary = (min: number, max: number, currentIndex: number): number => {
    let index = -1;
    do {
        index = Math.floor(Math.random() * (max - min) + min);
    } while (index == currentIndex && max > 1)

    return index;
}

const saveGroup = (setGetResult: any, group: IGroup, updateWords: IWord[]) => {
    const _group = { ...group, Words: updateWords };

    setLocalGroup(_group);
    setGetResult(_group);
}

export const PlaySpace = () => {

    const { userInfo } = useContext(UserContext);
    const { summary, updateValue } = useContext(PlayContext);
    const [result, setGetResult] = useState<IGroup>(groupDefault);
    const [indexWord, setIndexWord] = useState<number>(-1);
    // const [hasChanged, setHasChanged] = useState(false);
    const [hasDoNextValue, setHasDoNextValue] = useState(false);
    const [isEndedCycle, setIsEndedCycle] = useState(false);
    const [isVeryEndedCycle, setIsVeryEndedCycle] = useState(false);
    const [currentCycle, setCurrentCycle] = useState<number>(0);
    const intervalIdRef = useRef<NodeJS.Timer | null>(null);
    const [isHistorifyMessageEnable, setIsHistorifyMessageEnable] = useState<boolean>(false);
    const [isHistorified, setIsHistorified] = useState(false);
    // const [globalSummary, setGlobalSummary] = useState<IGlobalSummary>(globalSummaryDefault);
    const inputTextMatchRef = useRef<HTMLInputElement>(null);
    const [audioUrl, setAudioUrl] = useState('');

    const navigate = useNavigate();

    const handleRefreshClick = () => {
        const updateWords = [...result.Words];

        updateWords.forEach(_ => {
            _.Reveled = false;
            _.IsKnowed = false;
            _.Cycles = 0;
        })

        setCurrentCycle(0);

        saveGroup(setGetResult, result, updateWords);

        setIsVeryEndedCycle(false);
    }

    const handleHistorifyClick = () => {
        Adapter.historify(userInfo.UserId, result);
        setIsHistorifyMessageEnable(false);
        setIsHistorified(true);
    }

    const riseTheVoice = async () => {
        textToSpeech(result.Words[indexWord]?.Name, 'en-US');

        // let urlVoice = ''; // await textToSpeech(result.Words[indexWord]?.Name, 'en-US') || '';

        // setAudioUrl(urlVoice);
    }

    const nextValue = () => {

        let wordsFilterd = result.Words.filter(_ => !_.IsKnowed && !_.Reveled && _.Cycles == currentCycle);
        let arbitraryIndex = getRandomArbitrary(0, wordsFilterd.length, indexWord);

        let nextElement = wordsFilterd[arbitraryIndex];

        if (inputTextMatchRef.current) {
            inputTextMatchRef.current.focus();
        }

        if (nextElement) {

            arbitraryIndex = result.Words.findIndex(_ => _.Name === nextElement.Name);

            setIndexWord(arbitraryIndex);

            const updateWords = [...result.Words];

            updateWords[arbitraryIndex] = nextElement;

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
                setHasDoNextValue(true);

                saveGroup(setGetResult, result, updateWords);

            }
        }
    }
    const revel = () => {
        const updateWords = [...result.Words];

        const item = updateWords[indexWord];

        item.Reveled = true;

        updateWords[indexWord] = item;

        saveGroup(setGetResult, result, updateWords);
        // setGetResult({ ...result, Words: updateWords });
    }
    const correct = () => {

        const updateWords = [...result.Words];

        const item = updateWords[indexWord];

        item.IsKnowed = true;

        updateWords[indexWord] = item;

        saveGroup(setGetResult, result, updateWords);
        // setGetResult({ ...result, Words: updateWords });

        nextValue();
    }
    const getData = async () => {
        let group = await Adapter.getGroup(userInfo.UserId, userInfo.PlayingGroup.toString()) as IGroup;

        setGetResult(group);
        setHasDoNextValue(true);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsEndedCycle(false);
        }, 4000);
        return () => clearTimeout(timer);
    }, [isEndedCycle]);

    useEffect(() => {
        if (result.Words.length > 0)
            updateValue(calculateSummary(result, countSummary(result, currentCycle)));
    }, [result])

    useEffect(() => {

        if (hasDoNextValue === true) {
            setHasDoNextValue(false);
            nextValue();
        }



    }, [hasDoNextValue, currentCycle])

    useEffect(() => {

        if (summary.Total > 0 && summary.Total === summary.Learned) {
            setIsEndedCycle(false);
            setIsVeryEndedCycle(true);
        }


    }, [summary]);

    useEffect(() => {

        if (userInfo.PlayingGroup == "0")
            navigate(`/groups`);
        else {
            setCurrentCycle(0);
            getData();
        }
    }, []);

    useEffect(() => {
        // This code will only run once, when the component mounts
        if (userInfo.TimeOutActived > 0 && result.Words.length > 0)
            intervalIdRef.current = setInterval(() => {

                if (indexWord >= 0 && !result.Words[indexWord].Reveled) {
                    revel();

                    // riseTheVoice();
                }
                else {
                    nextValue();
                }
                console.log('nextValue');

            }, userInfo.TimeOutActived * 1000);

        // This function will run when the component unmounts
        return () => {
            clearInterval(intervalIdRef.current as NodeJS.Timeout);
        };
    }, [userInfo.TimeOutActived, indexWord, result]);

    if (indexWord < 0 && !isVeryEndedCycle)
        return <div>Loading..</div>

    return (
        <div>
            {audioUrl && <audio src={audioUrl} controls />}

            <div>
                <Header title="Play" />
            </div>

            <div>
                <Subtitle>Progress</Subtitle>
            </div>
            <div>
                <GlobalSummary currentCycle={currentCycle} value={summary}></GlobalSummary>
            </div>
            <div>
                <Subtitle>Group "{result.Name}"</Subtitle>
            </div>
            {indexWord >= 0 && <div>

                <Play word={result.Words[indexWord]}
                    currentCycle={currentCycle}
                    inputTextMatchRef={inputTextMatchRef}
                    next={() => nextValue()}
                    revel={() => revel()}
                    correct={() => { correct(); }}></Play>
            </div>}

            <div>
                {
                    isHistorifyMessageEnable && <ConfirmationDialog message="Words learned will move into the history group, do you want to continue?" onConfirm={handleHistorifyClick} open={isHistorifyMessageEnable} onClose={() => setIsHistorifyMessageEnable(false)} />
                }
                {
                    isEndedCycle &&
                    <Alert severity="info">
                        <AlertTitle>God Job!</AlertTitle>
                        You have came at the end — <strong>keep it up!</strong>

                    </Alert>}
                {
                    isVeryEndedCycle &&
                    <Alert severity="success">
                        <AlertTitle>Great Gig!, you learned {summary.Learned} and attain an {Math.ceil(summary.Learned / summary.Total * 100)} of progress</AlertTitle>
                        <strong>You have finalized!</strong>

                        <Box>
                            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={handleRefreshClick}>
                                Restart
                            </Button>
                            <Button disabled={isHistorified} variant="outlined" startIcon={<CallSplitIcon />} onClick={() => setIsHistorifyMessageEnable(true)}>
                                Historify
                            </Button>
                        </Box>

                    </Alert>
                }
            </div>
        </div>)


}