import { IWord } from "./IWord"

export interface IGroup {
    id: number
    name: string
    words: IWord[]
}

export interface IGroupProps {
    item: IGroup
}

