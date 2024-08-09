import { IGlobalSummary } from "../interfaces/IGlobalSummary";
import { IGroup } from "../interfaces/IGroup";
import { ISummary } from "../interfaces/ISummary";
import { IUserInfo } from "../interfaces/IUserInfo";
import { IWord } from "../interfaces/IWord.js";
import { LoginStatus, StatusChange } from "../models/Enums";
import { Group } from "../models/Group";
import { Word } from "../models/Word";
// import { TextToSpeechClient } from '@google-cloud/text-to-speech';

export const ofuscator = (text: string) => {
    const paddedString = text.replace(/[^/]/g, 'x');
    return paddedString;
}

export const countSummary = (group: IGroup, currentCycle: number): ISummary => {
    return group.Words.filter(_ => _.Cycles === currentCycle).reduce<ISummary>((accum, curr) => {
        let ok: number = accum.ok, bad: number = accum.bad;
        if (curr.IsKnowed)
            ok = accum.ok + 1;
        if (curr.Reveled && !curr.IsKnowed)
            bad = accum.bad + 1;
        return {
            ok, bad
        }
    },
        { ok: 0, bad: 0 });
}
export const globalSummaryDefault = {
    Learned: 0, Recongnized: 0, Known: 0, Discovered: 0, Total: 0, Unknow: 0, Summary: { ok: 0, bad: 0 }
}
export const getCurrentLearned = (summary: IGlobalSummary, currentCycle: number) => {
    switch (currentCycle) {
        case 0:
            return summary.Learned;
        case 1:
            return summary.Discovered;
        case 2:
            return summary.Recongnized;
        case 3:
            return summary.Known;
    }
}

export const globalUserDefault : IUserInfo = {
    UserId: 'anonymous'
    , FullName: 'anonymous'
    , imageUrl: ''
    , PlayingGroup: "0"
    , FirstShowed: false
    , UserName: ''
    , UserEmail: ''
    , IsInLogin: false
    , PromptActived: false
    , TimeOutActived: -1
    , provider: ''
    , AccessToken: ''
    , RefreshToken: ''
    , Drive: {idFolder: ''} 
    , Groups: []
    , TokenExpiration: new Date('1900-01-01T12:00:00Z')
    , Login: {
        Code: ''
        , LoginStatus: LoginStatus.Done
        , Redirect: ''
    }

}

export const groupDefault = Group.NewGroup();

export const calculateSummary = (group: IGroup, summary: ISummary): IGlobalSummary => {
    let Learned: number = 0;
    let Recongnized: number = 0;
    let Known: number = 0;
    let Discovered: number = 0;

    group.Words.forEach((word) => {

        if (word.IsKnowed && word.Cycles === 0)
            Learned++;

        if (word.IsKnowed && word.Cycles === 1)
            Discovered++;

        if (word.IsKnowed && word.Cycles === 2)
            Recongnized++;

        if (word.IsKnowed && word.Cycles === 3)
            Known++;
    });
    return {
        Learned
        , Recongnized
        , Known
        , Discovered
        , Total: group.Words.length
        , Unknow: group.Words.length - (Learned + Recongnized + Known + Discovered)
        , Summary: summary
    }

}

export const checkGroupConsistency = (group: IGroup | undefined) => {
    if (!group)
        return undefined;
    return { ...group, Words: group.Words.filter(_ => _ !== undefined).map(_ => Word.newWord(_)) }
}

export const getLastGroupId = (groups: IGroup[]) => {
    return (parseInt(groups.reduce((max: IGroup, obj: IGroup) => {
        return parseInt(obj.Id) > parseInt(max.Id) ? obj : max;
    }, new Group("0", StatusChange.None)).Id) + 1).toString();
}

const filterWordByWord = (word: string, filter: string) => {

    let filterResult = false;

    word.split(' ').forEach(_ => {
        if (_ === filter) {
            filterResult = true;
            return;
        }
    });

    return filterResult;
}

export const filterWordByType = (type: string, word: IWord, filter: string) => {

    if (type === 'Name')
        return filterWordByWord(word.Name.toLowerCase(), filter.toLowerCase())
    else
        return filterWordByWord(word.Value.toLowerCase(), filter.toLowerCase());
}

// const client = new TextToSpeechClient();

export const textToSpeech = async (text: string, languageCode: string) => {
    try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = languageCode;

        speechSynthesis.speak(utterance);

        // const [response] = await client.synthesizeSpeech({
        //   input: { text },
        //   voice: { languageCode: languageCode, ssmlGender: "NEUTRAL" },
        //   audioConfig: { audioEncoding: "MP3" },
        // });

        // const audioContent = response.audioContent;
        // const base64String = btoa(String.fromCharCode(...new Uint8Array(audioContent)));
        // const audioSrc = `data:audio/mp3;base64,${base64String}`;
        // return audioSrc;
    } catch (error) {
        console.error(error);
    }
}