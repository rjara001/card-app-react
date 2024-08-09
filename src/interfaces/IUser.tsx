import { IGroup } from "./IGroup"

export interface IUser {
    UserId: string
    Groups: IGroup[]
}