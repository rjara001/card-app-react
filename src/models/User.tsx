import { IGroup } from "../interfaces/IGroup";
import { IUser } from "../interfaces/IUser";
import { IUserInfo } from "../interfaces/IUserInfo";
import { Adapter } from "../locals/adapter";

import { parseCsv } from "../util/csvToJson";

export class User implements IUser {

    IdUser: string;
    Groups: IGroup[];

    constructor(idUser: string, groups: IGroup[]) {
        this.IdUser = idUser;
        this.Groups = groups;
    }
    
    static newUser(resp: any) {
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
    
    static Login(userInfo:IUserInfo, keycloak:any){
        userInfo.keycloak = keycloak;
        userInfo.UserId = keycloak.tokenParsed.email;
        userInfo.FullName = keycloak.tokenParsed.name;
        // userInfo.imageUrl = keycloak.tokenParsed.imageUrl;
      
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
        userInfo.IsInLogin = false;
        userInfo.UserId = '';
        userInfo.FullName = '';
        userInfo.imageUrl = '';
        userInfo.provider = '';

        Adapter.cleanLocalGroups();

        Adapter.setUser(userInfo);
    }

}


