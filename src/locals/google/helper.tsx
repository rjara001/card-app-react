import { IUserInfo } from "../../interfaces/IUserInfo";
import { _DRIVE } from "../../constants/drive";
import { IGroup } from "../../interfaces/IGroup";
import { createFolder, createNewFile, getIdFileByItsChildFiles, loadIdFolder, uploadFile, ValidateTokenWithGoogle } from "../../hooks/google.hook";
import { jsonToCsv } from "../../util/csvToJson";
import { User } from "../../models/User";
import { getAWSData } from "../../hooks/aws.lambda.hook";

const saveGroup = async (user:IUserInfo, group: IGroup) => {
    await TokenValidation(user);

    await loadFolder(user);

    group.IdDriveFile = await loadIdFile(user, group.IdDriveFile, group.keyFileName);

    const fileContent = jsonToCsv(group.Words);
    
    await uploadFile(user, group.IdDriveFile, fileContent);

}

const loadFolder = async (user: IUserInfo) => {

    if (user.Drive.IdFolder === null || user.Drive.IdFolder ==='')
        await loadIdFolder(user);

    if (user.Drive.IdFolder === null || user.Drive.IdFolder ==='')
        await createFolder(user);
};

const loadIdFile = async (user:IUserInfo, idFile:string, fileName:string) =>{
    // async function loadIdFile(folder: string, fileName: string, idFile: string): Promise<string> {
        if (user.Drive.IdFolder && !idFile) {
            idFile = await getIdFileByItsChildFiles(user, fileName);
        }
    
        if (!idFile) {
            idFile = await createNewFile(user, fileName);
        }
    
        return idFile;
    // }
    
}

const TokenValidation = async (user:IUserInfo) => {
    
    var isValid = await ValidateTokenWithGoogle(user);

    if (!User.hasRefreshToken(user) && !isValid) {
        throw new Error("Token is null or expired.");
    } else if (!isValid) {
        user.AccessToken = (await getAWSData(user)).UserToken.Token;
    }
}

export {
    loadFolder
    , saveGroup
}
