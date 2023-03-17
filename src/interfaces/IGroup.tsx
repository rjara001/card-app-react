import { IWord } from "./IWord"

export interface IGroup {
    Id: number
    Name: string
    Words: IWord[]
}

export interface IGroupProps {
    item: IGroup
}

