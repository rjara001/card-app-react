import { StatusChange } from "../models/Enums"
import { IWord } from "./IWord"

export interface IGroup {
    IdDriveFile: string
    Id: string
    Name: string
    LastModified: Date
    Status: StatusChange
    Words: IWord[]
    keyFileName: string
}

export interface IUserGroup {
    userId: string
    groups: IGroup[]
}

export interface IGroupProps {
    item: IGroup
    filter: string
    deleteGroup: (item:IGroup)=> void
}

