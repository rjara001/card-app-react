import { _DRIVE } from "../constants/drive";
import { IFlatGroup } from "../interfaces/IFlatGroup";
import { IGroup } from "../interfaces/IGroup";
import { IWord } from "../interfaces/IWord";
import { jsonToCsv, parseCsv } from "../util/csvToJson";
// import { generateUniqueFileName } from "../util/util";
import { StatusChange } from "./Enums";

export class Group implements IGroup {
    Id: string;
    Name: string;
    Words: IWord[];
    Status: StatusChange;
    LastModified: Date;
    keyFileName: string;
    IdDriveFile:string;
    static HISTORY_ID: string = "-1"

    constructor(Id:string, status: StatusChange) {
        this.Id=Id;
        this.Name = 'New Group';
        this.Words = []
        this.Status = status; // StatusChange.None;
        this.LastModified = new Date();
        this.keyFileName = '';
        this.IdDriveFile = '';
    }

    static toFlatGroup(group: IGroup): string {

        const flat = {
            Id: group.Id
            , Name: group.Name
            , Words: jsonToCsv(group.Words)
        };

        return JSON.stringify(flat);
    }

    static toGroup(fileId:string, keyFile: string, content: string): IGroup {
        const flatGroup = typeof content === 'string'?JSON.parse(content):content as IFlatGroup;
        

        return {...Group.NewGroupSynced(flatGroup.Id, flatGroup.Name, keyFile, fileId), Words : parseCsv(flatGroup.Words)}
    }

    static NewGroupDefault() {
        return new Group("0", StatusChange.None); // { Id: "0", Name: '', Words: [] }
    }

    static NewGroupCreated(id:string) {
        const newGroup: IGroup = new Group(id, StatusChange.Created);
        newGroup.keyFileName = _DRIVE.DRIVE_FILE_PREFIX + generateUniqueFileName();

        return newGroup;
    }
    static NewGroupSynced(id:string, name:string, keyFile:string, fileId:string):IGroup {
        const newGroup: IGroup = new Group(id, StatusChange.Synced);
        newGroup.Name = name;
        newGroup.keyFileName = keyFile;
        newGroup.IdDriveFile = fileId;

        return newGroup;
    }

    static NewGroupHistory() {
        const group = new Group(Group.HISTORY_ID, StatusChange.Historify);
        group.Name = '__History_Learned';

        return group;
    }

}


const generateUniqueFileName = (extension: string = "json"): string => {
    // Get the current timestamp
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 17); // Format to "yyyyMMddHHmmssfff"

    // Generate a UUID
    const uuid = crypto.randomUUID().replace(/-/g, ''); // Generate a 32-character UUID without hyphens

    // Combine the timestamp and UUID
    const uniqueFileName = `${timestamp}_${uuid}.${extension}`;

    return uniqueFileName;
}