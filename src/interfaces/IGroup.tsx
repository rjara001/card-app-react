import { StatusChange } from "../models/Enums"
import { IWord } from "./IWord"

export interface IGroup {
    Id: string
    Name: string
    LastModified: Date
    Status: StatusChange
    Words: IWord[]
}

export interface IGroupProps {
    item: IGroup
    filter: string
    deleteGroup: (item:IGroup)=> void
}

