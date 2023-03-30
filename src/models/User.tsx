import { IFlatGroup } from "../interfaces/IFlatGroup";
import { IFlatUser } from "../interfaces/IFlatUser";
import { IGroup } from "../interfaces/IGroup";
import { IUser } from "../interfaces/IUser";

import { jsonToCsv, parseCsv } from "../util/csvToJson";

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

}


