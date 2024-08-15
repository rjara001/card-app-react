import axios from "axios";
import { IUserInfo } from "../interfaces/IUserInfo";
import { User } from "../models/User";
import { ITokenInfo } from "../interfaces/ITokenInfo";
import { IDriveFileInfo } from "../interfaces/Drive/IDriveFileInfo";
import { IFileItem } from "../interfaces/Drive/IFileItem";
import { _DRIVE } from "../constants/drive";
import { TokenExpiredError } from "../models/Error";


export const deleteFile = async (user:IUserInfo, fileId:string) =>
{
    const apiUrl = `https://www.googleapis.com/drive/v3/files/${fileId}`;

    try {
        const response = await axios.delete(apiUrl, {
            headers: {
                Authorization: `Bearer ${user.AccessToken}`,
            },
        });

        if (response.status === 204) { // Status code 204 indicates successful deletion
            return true;
        } else {
            return false;
        }
    } catch (error) {

        return false;
    }
}
export const uploadFile = async (user: IUserInfo, idFile: string, fileContent: string): Promise<boolean> => {
    const apiUrl = `https://www.googleapis.com/upload/drive/v3/files/${idFile}`;

    const headers = {
        'Authorization': `Bearer ${user.AccessToken}`,
        'Content-Type': 'text/plain' // Assuming fileContent is plain text, adjust if necessary
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'PATCH',
            headers,
            body: fileContent
        });

        return response.ok;
    } catch (error) {
        console.error('Error uploading file:', error);
        return false;
    }
}

export const loadIdFolder = async (user: IUserInfo) => {
    const token = user.AccessToken;

    const getFileUrl = `https://www.googleapis.com/drive/v3/files?q=name='${encodeURIComponent(_DRIVE.DRIVE_NAME_FOLDER)}' and trashed=false and mimeType='application/vnd.google-apps.folder'`;

    try {
        const response = await axios.get(getFileUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": 'application/json'
            }
        });

        if (response.status === 200) {
            const streamFile = response.data;

            const fileListResponse: IDriveFileInfo = { files: [] };
            Object.assign(fileListResponse, streamFile);

            if (fileListResponse && fileListResponse.files.length > 0) {
                user.Drive.IdFolder = fileListResponse.files[0].id;
            }
        }
    } catch (error) {
        console.error('Error loading folder ID:', error);
    }
};
export const createFolder = async (user: IUserInfo) => {
    const parentId = 'root';

    // Create the JSON request body
    const requestBody = {
        name: _DRIVE.DRIVE_NAME_FOLDER,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [parentId],
    };

    try {
        // Make a POST request to create the folder
        const response = await axios.post(
            'https://www.googleapis.com/drive/v3/files',
            requestBody,
            {
                headers: {
                    'Authorization': `Bearer ${user.AccessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // Check if the request was successful
        if (response.status === 200) {
            // Get the folder ID from the response
            const fileItem = response.data;

            // Assuming you have a state setter function to save the folder ID
            if (fileItem) {
                user.Drive.IdFolder = fileItem.id;
            }
        } else {
            console.error('Failed to create folder:', response.statusText);
        }
    } catch (error) {
        console.error('An error occurred while creating the folder:', error);
    }
}

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
                'Content-Type': 'application/json;charset=UTF-8',
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
    const param1 = encodeURIComponent(`parents='${user.Drive.IdFolder}' and trashed=false`);
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
                user.Drive.IdFolder = fileListResponse.files[0].id;
            }
        }
    } catch (error) {
        console.error('Error retrieving folder ID:', error);
    }
}

export const getIdFileByItsChildFiles = async (user:IUserInfo, fileName: string): Promise<string> => {
    const param1 = encodeURIComponent(`parents='${user.Drive.IdFolder}' and trashed=false and name='${_DRIVE.DRIVE_FILE_PREFIX}'`);
    const param2 = encodeURIComponent("fields=files(id,name,size,mimeType,trashed)");

    const apiUrl = `https://www.googleapis.com/drive/v3/files?q=${param1}&${param2}`;

    const headers = {
        'Authorization': `Bearer ${user.AccessToken}`,
        'Accept': 'application/json'
    };

    try {
        const response = await fetch(apiUrl, { method: 'GET', headers });

        if (response.ok) {
            const streamFile = await response.json() as IDriveFileInfo;

            if (streamFile && streamFile.files.length === 1) {
                const fileItem = streamFile.files.find(file => file.name === fileName);
                return fileItem?.id || '';
            }
        }
    } catch (error) {
        console.error('Error fetching file data:', error);
    }

    return '';
}

export const createNewFile = async (user:IUserInfo, nameFile: string): Promise<string> => {
    const apiUrl = `https://content.googleapis.com/drive/v3/files`;

    const headers = {
        'Authorization': `Bearer ${user.AccessToken}`,
        'Content-Type': 'application/json'
    };

    const body = JSON.stringify({
        name: nameFile,
        parents: [user.Drive.IdFolder]
    });

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers,
            body
        });

        if (response.ok) {
            const fileItem = await response.json() as IFileItem;
            return fileItem.id || '';
        }
    } catch (error) {
        console.error('Error creating new file:', error);
    }

    return '';
}

export const ValidateTokenWithGoogle = async (user: IUserInfo): Promise<boolean> => {
    if (!User.hasAccessToken(user)) {
        return false;
    }

    const token = user.AccessToken;
    const url = `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${encodeURIComponent(token)}`;

    try {
        const response = await fetch(url);

        if (response.ok) {
            const content = await response.json() as ITokenInfo;

            // Check if the token is expired
            const expirationTime = new Date(content.exp * 1000); // Convert Unix timestamp to JavaScript Date
            if (expirationTime > new Date()) {
                return true;
            }
        } else {
            throw new TokenExpiredError();
        }
    } catch (error) {
        console.error('Error during token validation:', error);
        throw new TokenExpiredError();
    }

    return false;
}


