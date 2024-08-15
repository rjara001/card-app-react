import { IGlobalSummary } from "./IGlobalSummary"

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
    , setGroup: any
}

export interface IGlobalSummaryProps {
    value: IGlobalSummary
    currentCycle: number
}

export interface IWordProps {
    word: IWord
    backEnabled:boolean,
    back: (words:IWord[]) => void
    next: (words:IWord[]) => void
    revel: (word:IWord) => void
    correct: (word:IWord) => void
    currentCycle: number
    inputTextMatchRef: any;
}


