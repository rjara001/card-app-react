import { IGroup } from "../interfaces/IGroup";
import { ISummary } from "../interfaces/ISummary";

export const ofuscator = (text: string) => {
    return String('').padStart(text.length - 1, 'x');
}

export const countSummary = (group: IGroup) => {
    return group.words.reduce<ISummary>((accum, curr) => ({

        ok: (curr.isKnowed) ? accum.ok + 1 : 0,
        bad: (curr.reveled && !curr.isKnowed) ? accum.ok + 1 : 0,

    }),
        { ok: 0, bad: 0 });
}