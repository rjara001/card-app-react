import { IFlatGroup } from "../interfaces/IFlatGroup";
import { IGroup, IUserGroup } from "../interfaces/IGroup";
import { IWord } from "../interfaces/IWord";
import { jsonToCsv } from "../util/csvToJson";
import { StatusChange } from "./Enums";

export class UserGroup implements IUserGroup {

    userId: string;
    groups: IGroup[];

    constructor(Id:string, groups: IGroup[]) {
        this.userId=Id;
        this.groups = groups;
    }

    static NewUserGroup(userId:string) {
        return new UserGroup(userId, []);
    }

}