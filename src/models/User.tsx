import { IGoogleUserInfo } from "../interfaces/AWS/IResponse";
import { ITokenResponse } from "../interfaces/Google/ITokenResponse";
import { IGroup } from "../interfaces/IGroup";
import { IUser } from "../interfaces/IUser";
import { IUserInfo } from "../interfaces/IUserInfo";
import { Adapter } from "../locals/adapter";

import { parseCsv } from "../util/csvToJson";
import { globalUserDefault } from "../util/util";
import { LoginStatus, StatusChange } from "./Enums";

export class User implements IUser {
    static SetAuth(user: IUserInfo, googleUser: IGoogleUserInfo, tokens: ITokenResponse) {

        const minutes = Math.floor(tokens.expires_in / 60);

        const _user = {...user,
            AccessToken : tokens?.access_token ?? ''
            , RefreshToken : tokens?.refresh_token ?? ''
            , imageUrl : googleUser.picture
            , UserEmail : googleUser.email
            , UserId : googleUser.email
            , FullName : googleUser.name
            , IsInLogin : true
            , TokenExpiration : new Date(Date.now() + minutes * 60 * 1000)
            
            , Login: { ...user.Login, LoginStatus : LoginStatus.Done}
        };

        return _user;

    }

    static hasAccessToken(user: IUserInfo) {
        return user.AccessToken !== null && user.AccessToken !== '';
    }

    UserId: string;
    Groups: IGroup[];

    constructor(idUser: string, groups: IGroup[]) {
        this.UserId = idUser;
        this.Groups = groups;
    }
    

    static LoginFacebook(userInfo:IUserInfo, response: any) {
        userInfo.IsInLogin = User.hasAccessToken(userInfo);
        userInfo.UserId = response.email;
        userInfo.AccessToken = response.accessToken;
        userInfo.FullName = response.name;
        userInfo.imageUrl = response.picture.data.url;
        userInfo.provider = 'facebook';
        Adapter.setUser(userInfo);
    }

    static LoginGoogle(userInfo:IUserInfo){
        userInfo.IsInLogin = User.hasAccessToken(userInfo);
       
        userInfo.provider = 'google';
        Adapter.setUser(userInfo);
        
    }

    static LoginCustom(userInfo:IUserInfo, response:any) {
        userInfo.IsInLogin = User.hasAccessToken(userInfo);
        userInfo.UserId = response.idToken.payload.email;
        userInfo.FullName = response.idToken.payload.name;
        userInfo.AccessToken = response.accessToken;
        userInfo.provider = 'amazon';
        Adapter.setUser(userInfo);
    }

    static hasRefreshToken(userInfo:IUserInfo) {
        return userInfo.RefreshToken !== null && userInfo.RefreshToken !== '';
    }

    static LoginClean(userInfo:IUserInfo)
    {
        userInfo = globalUserDefault;
        Adapter.setUser(userInfo);

        return userInfo;
    }

    static TokenIsExpired(userInfo:IUserInfo) {
        return userInfo.TokenExpiration  < new Date();
    }

    static getGroups(userInfo:IUserInfo): IGroup[] {
        return userInfo.Groups.filter(_=>_.Status!== StatusChange.Deleted)
    }
}


