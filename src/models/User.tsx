import { IGoogleUserInfo } from "../interfaces/AWS/IResponse";
import { IGroup } from "../interfaces/IGroup";
import { IUser } from "../interfaces/IUser";
import { IUserInfo } from "../interfaces/IUserInfo";
import { Adapter } from "../locals/adapter";

import { globalUserDefault } from "../util/util";
import { LoginStatus, StatusChange } from "./Enums";

export class User implements IUser {
    static SetAuth(googleUser: IGoogleUserInfo) : IUserInfo {

        const minutes = Math.floor(googleUser.tokens.expires_in / 60);

        const _user = { ...globalUserDefault
            , AccessToken : googleUser.tokens?.access_token ?? ''
            , RefreshToken : googleUser.tokens?.refresh_token ?? ''
            , imageUrl : googleUser.picture
            , UserEmail : googleUser.email
            , UserId : googleUser.email
            , FullName : googleUser.name
            , IsInLogin : true
            , TokenExpiration : new Date(Date.now() + minutes * 60 * 1000)            
            , Login: { LoginStatus : LoginStatus.Done}
        };

        return _user as IUserInfo;

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
        return userInfo.RefreshToken !== undefined && userInfo.RefreshToken !== '';
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


