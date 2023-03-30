import { IGroup } from "./IGroup"

export interface IUser {
    IdUser: string
    Groups: IGroup[]
}