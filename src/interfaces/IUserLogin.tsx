import { LoginStatus } from "../models/Enums"

export interface IUserLogin {
    Code:string
    LoginStatus: LoginStatus
    Redirect: string
}