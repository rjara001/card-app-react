import { Navigation } from "../models/Navigation"
import { IUserDriveInfo } from "./Drive/IUserDriveInfo"
import { IGroup } from "./IGroup"
import { IUser } from "./IUser"
import { IUserLogin } from "./IUserLogin"

export interface IUserInfo extends IUser {
    Login: IUserLogin
    provider: string
    imageUrl: any
    FullName: any
    UserId: string
    PlayingGroup : string
    FirstShowed: boolean
    UserName: string
    UserEmail: string
    IsInLogin: boolean
    PromptActived: boolean
    TimeOutActived: number
    AccessToken: string
    RefreshToken: string
    Drive: IUserDriveInfo
    Groups: IGroup[]
    Navigation: Navigation
    TokenExpiration : Date
}