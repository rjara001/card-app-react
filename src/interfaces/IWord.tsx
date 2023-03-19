import { IGlobalSummary } from "./IGlobalSummary.js"

export interface IWord {
    Name:string
    Value: string
    Cycles: number
    IsKnowed: boolean
    Reveled: boolean

    getName(FirstShowed:boolean): string

    getValue(FirstShowed:boolean): string
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


