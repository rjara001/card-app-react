import { IGlobalSummary } from "./IGlobalSummary.js"

export interface IWord {
    name:string
    value: string
    cycles: number
    isKnowed: boolean
    reveled: boolean
}

export interface IWordsProps {
    words: IWord[]
}

export interface IGlobalSummaryProps {
    value: IGlobalSummary
    currentCycle: number
}

export interface IWordProps {
    word: IWord
    next: (words:IWord[]) => void
    revel: (word:IWord) => void
    correct: (word:IWord) => void
}


