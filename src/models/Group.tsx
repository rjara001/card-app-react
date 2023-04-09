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

    constructor(Id:string) {
        this.Id=Id;
        this.Name = 'New Group';
        this.Words = []
        this.Status = StatusChange.Created;
        this.LastModified = new Date();
    }

    static toFlatGroup(group: IGroup): IFlatGroup {
        return {... group, Words: jsonToCsv(group.Words)};
    }

    static NewGroup() {
        return new Group("0"); // { Id: "0", Name: '', Words: [] }
    }


}