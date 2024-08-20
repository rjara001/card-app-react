import { IUserInfo } from "../../interfaces/IUserInfo";
import { _DRIVE } from "../../constants/drive";
import { IGroup } from "../../interfaces/IGroup";
import { createFolder, createNewFile, deleteFile, getIdFileByItsChildFiles, loadIdFolder, uploadFile, ValidateTokenWithGoogle } from "../../hooks/google.hook";
import { User } from "../../models/User";
import { getAWSData } from "../../hooks/aws.lambda.hook";
import { TokenExpiredError } from "../../models/Error";
import { Group } from "../../models/Group";
import { StatusChange } from "../../models/Enums";

const saveGroup = async (user: IUserInfo, group: IGroup): Promise<IUserInfo> => {
    await TokenValidation(user);

    await loadFolder(user);

    group.IdDriveFile = await loadIdFile(user, group.IdDriveFile, group.keyFileName);

    const fileContent = Group.toFlatGroup(group);

    if (group.Status === StatusChange.Deleted)
    {
        await deleteFile(user, group.IdDriveFile);
        user.Groups = [...user.Groups.filter(_=>_.Id === group.Id)];
    }
    else{
        await uploadFile(user, group.IdDriveFile, fileContent);
        group.Status = StatusChange.Synced;
        user.Groups = [...user.Groups.filter(_=>_.Id === group.Id), group];
    }

    return user;
}

const loadFolder = async (user: IUserInfo) => {

    try {
        if (user.Drive.IdFolder === null || user.Drive.IdFolder === '')
        {
            await loadIdFolder(user);
        }
            

        if (user.Drive.IdFolder === null || user.Drive.IdFolder === '')
        {
            await createFolder(user);
        }
            
    } catch (error) {
        console.log(error);
    }

};

const loadIdFile = async (user: IUserInfo, idFile: string, fileName: string) => {
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

const TokenValidation = async (user: IUserInfo) => {

    var isValid = await ValidateTokenWithGoogle(user);

    if (!User.hasRefreshToken(user) && !isValid) {
        throw new TokenExpiredError()
    } else if (!isValid) {
        user.AccessToken = (await getAWSData(user)).UserToken.Token;
    }
}

export {
    loadFolder
    , saveGroup
    , TokenValidation
}