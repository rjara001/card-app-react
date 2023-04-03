import { IWord } from "./IWord"

export interface IGroup {
    Id: string
    Name: string
    Words: IWord[]
}

export interface IGroupProps {
    item: IGroup
    , deleteGroup: (item:IGroup)=> void
}

