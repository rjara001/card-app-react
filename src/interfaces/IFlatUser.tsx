import { IFlatGroup } from "./IFlatGroup"

export interface IFlatUser {
    IdUser: string
    Groups: IFlatGroup[]
}