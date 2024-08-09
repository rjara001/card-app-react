import axios from "axios";
import { IUserInfo } from "../../interfaces/IUserInfo";
import { IDriveFileInfo } from "../../interfaces/Drive/IDriveFileInfo";
import { _DRIVE } from "../../constants/drive";

const loadFolder = async (user: IUserInfo) => {

    if (user.Drive.idFolder === null || user.Drive.idFolder ==='')
        await loadIdFolder(user);

    if (user.Drive.idFolder === null || user.Drive.idFolder ==='')
        await createFolder(user);
};

const createFolder = async (user: IUserInfo) => {
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
                user.Drive.idFolder = fileItem.id;
            }
        } else {
            console.error('Failed to create folder:', response.statusText);
        }
    } catch (error) {
        console.error('An error occurred while creating the folder:', error);
    }
}

const loadIdFolder = async (user: IUserInfo) => {
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
                user.Drive.idFolder = fileListResponse.files[0].id;
            }
        }
    } catch (error) {
        console.error('Error loading folder ID:', error);
    }
};

export {
    loadFolder
}
// const getIdFileByItsChildFiles = async (folderName, fileName) => {
//     const param1 = encodeURIComponent(`parents='${_session.user.drive.idFolder}' and trashed=false and name='${Tabito.Model.Constants.DRIVE_USER_FILE_NAME}'`);
//     const param2 = encodeURIComponent('fields=files(id,name,size,mimeType,trashed)');
//     const apiUrl = `https://www.googleapis.com/drive/v3/files?q=${param1}&${param2}`;

//     try {
//         const response = await axios.get(apiUrl, {
//             headers: {
//                 Authorization: `Bearer ${_session.user.userToken.token}`,
//                 Accept: 'application/json'
//             }
//         });

//         if (response.status === 200) {
//             const fileListResponse = response.data;

//             if (fileListResponse && fileListResponse.files.length === 1) {
//                 return fileListResponse.files.find(file => file.name === fileName)?.id || '';
//             } else if (fileListResponse && fileListResponse.files.length === 2) {
//                 await deleteFiles();
//             }
//         }
//     } catch (error) {
//         console.error('Error fetching file ID:', error);
//     }

//     return '';
// };