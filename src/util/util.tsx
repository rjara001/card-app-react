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

export const calculateSummary = (group: IGroup): IGlobalSummary => {
    let Learned: number = 0;
    let Recongnized: number = 0;
    let Known: number = 0;
    let Discovered: number = 0;

    group.words.forEach((word) => {
        if (word.isKnowed && word.cycles === 1)
            Learned++;

        if (word.isKnowed && word.cycles === 2)
            Recongnized++;

        if (word.isKnowed && word.cycles === 3)
            Known++;

        if (word.isKnowed && word.cycles === 4)
            Discovered++;
    });
    return {
        Learned, Recongnized, Known, Discovered, Total: group.words.length, Unknow: group.words.length - (Learned + Recongnized + Known + Discovered)
    }
    // return group.words.reduce<IGlobalSummary>((accum, curr) => {

    //     let Learned: number = accum.Learned;
    //     let Recongnized: number = accum.Recongnized;
    //     let Known: number = accum.Known;
    //     let Discovered: number = accum.Discovered;

    //     if (curr.isKnowed && curr.cycles == 1)
    //         Learned = accum.Learned + 1;

    //     if (curr.isKnowed && curr.cycles == 2)
    //     Recongnized = accum.Recongnized + 1;

    //     if (curr.isKnowed && curr.cycles == 3)
    //     Known = accum.Known + 1;

    //     if (curr.isKnowed && curr.cycles == 4)
    //     Discovered = accum.Discovered + 1;

    //     return {
    //         Learned, Recongnized, Known, Discovered, total: group.words.length, unknow: group.words.length - (Learned + Recongnized + Known + Discovered)
    //     }
    // },
    //     {
    //         Learned: 0
    //         , Recongnized: 0
    //         , Known: 0
    //         , Discovered: 0
    //         , Total: group.words.length
    //         , Unknow: 0
    //     });
}