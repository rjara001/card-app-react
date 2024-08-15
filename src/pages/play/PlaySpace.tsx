import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import RefreshIcon from '@mui/icons-material/Refresh';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import { GlobalSummary } from "../../components/GlobalSummary";
import { PlayContext } from "../../context/context.create";
import { IGroup } from "../../interfaces/IGroup";
import { calculateSummary, countSummary, groupDefault, textToSpeech } from "../../util/util";
import { Play } from "../../components/Play/Play";
import Title from "../../molecule/Title";
import Subtitle from "../../molecule/SubTitle";
import { IWord } from "../../interfaces/IWord";
import { setLocalGroup } from "../../locals/group.local";
import { Adapter } from "../../locals/adapter";
import Header from "../../components/Header";
import ConfirmationDialog from "../../elements/Dialogs/ConfirmationDialog";
import { UserContext } from "../../context/context.user";

const getRandomArbitrary = (min: number, max: number, currentIndex: number): number => {
    let index: number;
    do {
        index = Math.floor(Math.random() * (max - min) + min);
    } while (index === currentIndex && max > 1);
    return index;
};

export const PlaySpace: React.FC = () => {
    const { userInfo } = useContext(UserContext);
    const { summary, updateValue } = useContext(PlayContext);
    const [result, setResult] = useState<IGroup>(groupDefault);
    const [indexWord, setIndexWord] = useState<number>(-1);
    const [hasDoNextValue, setHasDoNextValue] = useState<boolean>(false);
    const [isEndedCycle, setIsEndedCycle] = useState<boolean>(false);
    const [isVeryEndedCycle, setIsVeryEndedCycle] = useState<boolean>(false);
    const [currentCycle, setCurrentCycle] = useState<number>(0);
    const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
    const [isHistorifyMessageEnable, setIsHistorifyMessageEnable] = useState<boolean>(false);
    const [isHistorified, setIsHistorified] = useState<boolean>(false);
    const inputTextMatchRef = useRef<HTMLInputElement>(null);
    const [audioUrl, setAudioUrl] = useState<string>('');
    const navigate = useNavigate();

    const saveGroup = (group: IGroup, updateWords: IWord[]): void => {
        const updatedGroup = { ...group, Words: updateWords };
        setLocalGroup(userInfo, updatedGroup);
        setResult(updatedGroup);
    };

    const handleRefreshClick = () => {
        const updatedWords = result.Words.map(word => ({
            ...word,
            Reveled: false,
            IsKnowed: false,
            Cycles: 0
        }));
        setCurrentCycle(0);
        saveGroup(result, updatedWords);
        setIsVeryEndedCycle(false);
    };

    const handleHistorifyClick = () => {
        Adapter.historify(userInfo, result);
        setIsHistorifyMessageEnable(false);
        setIsHistorified(true);
    };

    const riseTheVoice = async () => {
        if (indexWord >= 0) {
            textToSpeech(result.Words[indexWord]?.Name, 'en-US');
        }
    };

    const nextValue = useCallback(() => {
        const wordsFiltered = result.Words.filter(word => !word.IsKnowed && !word.Reveled && word.Cycles === currentCycle);
        const arbitraryIndex = getRandomArbitrary(0, wordsFiltered.length, indexWord);

        const nextElement = wordsFiltered[arbitraryIndex];

        if (inputTextMatchRef.current) {
            inputTextMatchRef.current.focus();
        }

        if (nextElement) {
            const newIndex = result.Words.findIndex(word => word.Name === nextElement.Name);
            setIndexWord(newIndex);
            const updatedWords = [...result.Words];
            updatedWords[newIndex] = nextElement;
            saveGroup(result, updatedWords);
        } else {
            if (currentCycle >= 3) {
                setIsVeryEndedCycle(true);
            } else {
                const updatedWords = result.Words.map(word => (word.Cycles === currentCycle && !word.IsKnowed) ? { ...word, Reveled: false, Cycles: word.Cycles + 1 } : word);
                setIsEndedCycle(true);
                setCurrentCycle(prev => prev + 1);
                setHasDoNextValue(true);
                saveGroup(result, updatedWords);
            }
        }
    }, [currentCycle, indexWord, result, saveGroup]);

    const revel = useCallback(() => {
        if (indexWord >= 0) {
            const updatedWords = [...result.Words];
            const item = updatedWords[indexWord];
            item.Reveled = true;
            updatedWords[indexWord] = item;
            saveGroup(result, updatedWords);
        }
    }, [indexWord, result, saveGroup]);

    const correct = () => {
        if (indexWord >= 0) {
            const updatedWords = [...result.Words];
            const item = updatedWords[indexWord];
            item.IsKnowed = true;
            updatedWords[indexWord] = item;
            saveGroup(result, updatedWords);
            nextValue();
        }
    };

    const getData = async () => {
        const group = userInfo.Groups.find(group => group.Id === userInfo.PlayingGroup) as IGroup;
        setResult(group);
        setHasDoNextValue(true);
    };

    useEffect(() => {
        if (userInfo.PlayingGroup === "0") {
            navigate(`/groups`);
        } else {
            setCurrentCycle(0);
            getData();
        }
    }, [userInfo.PlayingGroup]);

    useEffect(() => {
        if (result.Words.length > 0) {
            updateValue(calculateSummary(result, countSummary(result, currentCycle)));
        }
    }, [result, currentCycle]);

    useEffect(() => {
        if (hasDoNextValue) {
            setHasDoNextValue(false);
            nextValue();
        }
    }, [hasDoNextValue]);

    useEffect(() => {
        if (summary.Total > 0 && summary.Total === summary.Learned) {
            setIsEndedCycle(false);
            setIsVeryEndedCycle(true);
        }
    }, [summary]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsEndedCycle(false);
        }, 4000);
        return () => clearTimeout(timer);
    }, [isEndedCycle]);

    useEffect(() => {
        if (userInfo.TimeOutActived > 0 && result.Words.length > 0) {
            intervalIdRef.current = setInterval(() => {
                if (indexWord >= 0 && !result.Words[indexWord].Reveled) {
                    revel();
                } else {
                    nextValue();
                }
            }, userInfo.TimeOutActived * 1000);

            return () => {
                clearInterval(intervalIdRef.current as NodeJS.Timeout);
            };
        }
    }, [userInfo.TimeOutActived, indexWord, result, revel, nextValue]);

    if (indexWord < 0 && !isVeryEndedCycle) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {audioUrl && <audio src={audioUrl} controls />}

            <Header title="Play" />

            <Subtitle>Progress</Subtitle>
            <GlobalSummary currentCycle={currentCycle} value={summary} />

            <Subtitle>Group "{result.Name}"</Subtitle>

            {indexWord >= 0 && (
                <Play
                    word={result.Words[indexWord]}
                    currentCycle={currentCycle}
                    inputTextMatchRef={inputTextMatchRef}
                    next={nextValue}
                    revel={revel}
                    correct={correct}
                />
            )}

            {isHistorifyMessageEnable && (
                <ConfirmationDialog
                    message="Words learned will move into the history group, do you want to continue?"
                    onConfirm={handleHistorifyClick}
                    open={isHistorifyMessageEnable}
                    onClose={() => setIsHistorifyMessageEnable(false)}
                />
            )}

            {isEndedCycle && (
                <Alert severity="info">
                    <AlertTitle>Good Job!</AlertTitle>
                    You have reached the end — <strong>keep it up!</strong>
                </Alert>
            )}

            {isVeryEndedCycle && (
                <Alert severity="success">
                    <AlertTitle>
                        Great job! You learned {summary.Learned} words and made {Math.ceil((summary.Learned / summary.Total) * 100)}% progress
                    </AlertTitle>
                    <strong>You have completed!</strong>
                    <Box>
                        <Button variant="outlined" startIcon={<RefreshIcon />} onClick={handleRefreshClick}>
                            Restart
                        </Button>
                        <Button disabled={isHistorified} variant="outlined" startIcon={<CallSplitIcon />} onClick={() => setIsHistorifyMessageEnable(true)}>
                            Historify
                        </Button>
                    </Box>
                </Alert>
            )}
        </div>
    );
};
