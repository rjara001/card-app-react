import { IFlatGroup } from "../interfaces/IFlatGroup";
import { IGroup } from "../interfaces/IGroup";
import { IWord } from "../interfaces/IWord";
import { jsonToCsv } from "../util/csvToJson";

export class Group implements IGroup {
    Id: string;
    Name: string;
    Words: IWord[];

    constructor(Id:string) {
        this.Id=Id;
        this.Name = 'New Group';
        this.Words = []
    }

    static toFlatGroup(group: IGroup): IFlatGroup {
        return {... group, Words: jsonToCsv(group.Words)};
    }


}