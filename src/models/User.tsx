import { IGroup } from "../interfaces/IGroup";
import { IUser } from "../interfaces/IUser";
import { IUserInfo } from "../interfaces/IUserInfo";
import { Adapter } from "../locals/adapter";

import { parseCsv } from "../util/csvToJson";
import { globalUserDefault } from "../util/util";

export class User implements IUser {

    IdUser: string;
    Groups: IGroup[];

    constructor(idUser: string, groups: IGroup[]) {
        this.IdUser = idUser;
        this.Groups = groups;
    }
    
    static newUser(resp: any) {
        if (resp==='')
            resp = new User('', []);

        const groups = resp.Groups.map((_: any)=>{
            return {... _, Words : parseCsv(_.Words)}
        });

        return new User(resp.idUser, groups);
    }

    static LoginFacebook(userInfo:IUserInfo, response: any) {
        userInfo.IsInLogin = true;
        userInfo.UserId = response.email;
        userInfo.FullName = response.name;
        userInfo.imageUrl = response.picture.data.url;
        userInfo.provider = 'facebook';
        Adapter.setUser(userInfo);
    }

    static LoginGoogle(userInfo:IUserInfo, response:any){
        userInfo.IsInLogin = true;
        userInfo.UserId = response.profileObj.email;
        userInfo.FullName = response.profileObj.name;
        userInfo.imageUrl = response.profileObj.imageUrl;
        userInfo.provider = 'google';
        Adapter.setUser(userInfo);
    }

    static LoginCustom(userInfo:IUserInfo, response:any) {
        userInfo.IsInLogin = true;
        userInfo.UserId = response.idToken.payload.email;
        userInfo.FullName = response.idToken.payload.name;
        userInfo.provider = 'amazon';
        Adapter.setUser(userInfo);
    }

    static LoginClean(userInfo:IUserInfo)
    {
        userInfo = globalUserDefault;
        Adapter.setUser(userInfo);

        return userInfo;
    }

}


