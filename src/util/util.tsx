import { IGlobalSummary } from "../interfaces/IGlobalSummary";
import { IGroup } from "../interfaces/IGroup";
import { ISummary } from "../interfaces/ISummary";
import { Group } from "../models/Group";
import { Word } from "../models/Word";

export const ofuscator = (text: string) => {
    return String('').padStart(text.length - 1, 'x');
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

export const globalUserDefault = {
    UserId: 'rjara'
    , PlayingGroup: "0"
    , FirstShowed: false
    , UserName: ''
    , UserEmail: ''
    , IsInLogin: false
    , PromptActived: false
    , TimeOutActived: -1
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
    return { ...group, Words: group.Words.filter(_ => _ != undefined).map(_ => Word.newWord(_)) }
}

export const getLastGroupId = (groups: IGroup[]) => {
    return (parseInt(groups.reduce((max: IGroup, obj: IGroup) => {
        return parseInt(obj.Id) > parseInt(max.Id) ? obj : max;
    }, new Group("0")).Id) + 1).toString();
}
// export const Base64ToJson = (base64:string) =>{
//     let text = decodeURIComponent(escape(atob(base64)));
//     return CsvToJson(text);
// }