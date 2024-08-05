import { IUserDriveInfo } from "./Drive/IUserDriveInfo"
import { IUser } from "./IUser"
import { IWord } from "./IWord"

export interface IUserInfo extends IUser {
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
    Words: [IWord]
    Drive: IUserDriveInfo
}