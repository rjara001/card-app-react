import { IGlobalSummary } from "../interfaces/IGlobalSummary";
import { IGroup } from "../interfaces/IGroup";
import { ISummary } from "../interfaces/ISummary";

export const ofuscator = (text: string) => {
    return String('').padStart(text.length - 1, 'x');
}

export const countSummary = (group: IGroup): ISummary => {
    return group.words.reduce<ISummary>((accum, curr) => {
        let ok: number = accum.ok, bad: number = accum.bad;
        if (curr.isKnowed)
            ok = accum.ok + 1;
        if (curr.reveled && !curr.isKnowed)
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

export const globalUserDefault = {
    UserId: 'rjara001@gmail.com'
    , PlayingGroup: 0
}

export const groupDefault = { id: 0, name: '', words: [] }

export const calculateSummary = (group: IGroup, summary: ISummary): IGlobalSummary => {
    let Learned: number = 0;
    let Recongnized: number = 0;
    let Known: number = 0;
    let Discovered: number = 0;

    group.words.forEach((word) => {

        if (word.isKnowed && word.cycles === 0)
            Learned++;

        if (word.isKnowed && word.cycles === 1)
            Discovered++;

        if (word.isKnowed && word.cycles === 2)
            Recongnized++;

        if (word.isKnowed && word.cycles === 3)
            Known++;
    });
    return {
        Learned
        , Recongnized
        , Known
        , Discovered
        , Total: group.words.length
        , Unknow: group.words.length - (Learned + Recongnized + Known + Discovered)
        , Summary: summary
    }

}