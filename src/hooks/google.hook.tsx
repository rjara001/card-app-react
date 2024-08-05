import axios from "axios";
import { IUserInfo } from "../interfaces/IUserInfo";
import { User } from "../models/User";
import { ITokenInfo } from "../interfaces/ITokenInfo";
import { IDriveFileInfo } from "../interfaces/Drive/IDriveFileInfo";
import { IFileItem } from "../interfaces/Drive/IFileItem";
import { _DRIVE } from "../constants/drive";

export const queryGetValidateTokenAccess = async (user: IUserInfo) => {
    if (!User.hasAccessToken(user)) {
        return false;
    }

    try {
        const response = await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${user.AccessToken}`);

        if (response.status === 200) {
            const tokenInfo: ITokenInfo = response.data;

            // Check if the token is expired
            const expirationTime = new Date(tokenInfo.exp * 1000); // Convert seconds since epoch to Date
            if (expirationTime > new Date()) {
                return true;
            }
        }
    } catch (error) {
        console.error('Error validating token with Google:', error);
    }

    return false;
}
const downloadFileContent = async (user: IUserInfo, fileId: string): Promise<string> => {
    const apiUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;

    try {
        const response = await axios.get(apiUrl, {
            headers: {
                Authorization: `Bearer ${user.AccessToken}`
            }
        });

        if (response.status === 200) {
            return response.data;
        } else {
            // Handle error response
            // await logger.warn("DownloadFileContent", response);

            return '';
        }
    } catch (error) {
        console.error('Error downloading file content:', error);
        return '';
    }
};

export const queryGetContentAllTableFile = async (user: IUserInfo): Promise<{ [key: string]: IFileItem }> => {
    const param1 = encodeURIComponent(`parents='${user.Drive.idFolder}' and trashed=false`);
    const param2 = encodeURIComponent('fields=files(id,name,size,mimeType,trashed)');
    const apiUrl = `https://www.googleapis.com/drive/v3/files?q=${param1}&${param2}`;

    try {
        const response = await axios.get(apiUrl, {
            headers: {
                Authorization: `Bearer ${user.AccessToken}`,
                Accept: 'application/json'
            }
        });

        if (response.status === 200) {
            const fileListResponse: IDriveFileInfo = response.data;

            if (fileListResponse && fileListResponse.files.length > 0) {
                const fileContentTasks = fileListResponse.files
                    .filter(file => file.name.toLowerCase().startsWith(_DRIVE.DRIVE_FILE_PREFIX))
                    .map(async file => ({
                        id: file.id,
                        file: {
                            name: file.name,
                            id: file.id,
                            content: await downloadFileContent(user, file.id)
                        }
                    }));

                const fileContents = await Promise.all(fileContentTasks);

                return fileContents.reduce((acc, { id, file }) => {
                    acc[id] = file;
                    return acc;
                }, {} as { [key: string]: IFileItem });
            }
        } else {
            // Log and handle the error response
            console.warn('getContentAllTableFile', response.status);
        }
    } catch (error) {
        console.error('Error retrieving table file contents:', error);
    }

    return {};
};

export const queryLoadIdFoler = async (user:IUserInfo) =>
{
    const token = user.AccessToken;
    const getFileUrl = `https://www.googleapis.com/drive/v3/files?q=name='${_DRIVE.DRIVE_NAME_FOLDER}' and trashed=false and mimeType='application/vnd.google-apps.folder'`;

    try {
        const response = await axios.get(getFileUrl, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status === 200) {
            const streamFile = response.data;
            const fileListResponse: IDriveFileInfo = streamFile;

            if (fileListResponse != null && fileListResponse.files.length > 0) {
                user.Drive.idFolder = fileListResponse.files[0].id;
            }
        }
    } catch (error) {
        console.error('Error retrieving folder ID:', error);
    }
}