import { IFlatGroup } from "../interfaces/IFlatGroup";
import { IGroup } from "../interfaces/IGroup";
import { IWord } from "../interfaces/IWord";
import { jsonToCsv } from "../util/csvToJson";
import { StatusChange } from "./Enums";

export class Group implements IGroup {
    Id: string;
    Name: string;
    Words: IWord[];
    Status: StatusChange;
    LastModified: Date;
    static HISTORY_ID: string = "-1"

    constructor(Id:string, status: StatusChange) {
        this.Id=Id;
        this.Name = 'New Group';
        this.Words = []
        this.Status = status; // StatusChange.None;
        this.LastModified = new Date();
    }

    static toFlatGroup(group: IGroup): IFlatGroup {
        return {...group, Words: jsonToCsv(group.Words)};
    }

    static NewGroup() {
        return new Group("0", StatusChange.None); // { Id: "0", Name: '', Words: [] }
    }

    static NewGroupHistory() {
        const group = new Group(Group.HISTORY_ID, StatusChange.Historify);
        group.Name = '__History_Learned';

        return group;
    }
}