import { _DRIVE } from "../constants/drive";
import { IFlatGroup } from "../interfaces/IFlatGroup";
import { IGroup } from "../interfaces/IGroup";
import { IWord } from "../interfaces/IWord";
import { jsonToCsv } from "../util/csvToJson";
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

    static getKeyFileName(group: IGroup): string {
        if (!group.keyFileName || group.keyFileName.trim() === "") {
            const nameFile = `${_DRIVE.DRIVE_NAME_FOLDER}${generateUniqueFileName()}`;
            group.keyFileName = nameFile;
        }

        return group.keyFileName;
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