import { gapi } from "gapi-script";
import { IUser } from "../interfaces/IUser";
import { IGroup } from "../interfaces/IGroup";
import { jsonToCsv, jsonToCsvRaw } from "../util/csvToJson";
import { IUserInfo } from "../interfaces/IUserInfo";
import { checkIfTokenExpired, refreshAccessToken } from "./token";

const FOLDER_NAME = '__glimmind.com'

interface Params {
    [key: string]: string | undefined;
    q: string;
    fields: string;
    key?: string;
  }

function encodeParams(params: Params): string {
    return Object.keys(params)
      .map((key: string) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key] || '')}`)
      .join('&');
  }

async function createFile(user: IUserInfo) {
    const parentId = 'root'; // some parentId of a folder under which to create the new folder
    const folderName = '__Glim';
    const folderQuery = `mimeType='application/vnd.google-apps.folder' and trashed=false and name='${folderName}' and parents in '${parentId}'`;
    try {
        // Search for the folder
        
        const params = {
            q: folderQuery,
            fields: 'nextPageToken, files(id, name)',
            key: process.env.REACT_APP_API_KEY_GOOGLE
        };

        let q = encodeParams(params); //  Object.keys(params).map((key: string) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&');

        const base = 'https://content.googleapis.com/drive/v3/files?'

        const url = base + q;

        const shouldRefreshToken = checkIfTokenExpired(); // Implement your own logic to determine if token refresh is needed

        let accessToken = user.AccessToken;

        if (shouldRefreshToken) {
          // Call the token refresh function
          accessToken = await refreshAccessToken(user.AccessToken);
        }
    
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            const data = await response.json();

            if (response.status === 200) {
                if (data.files.length > 0) {
                    // Folder already exists, return it
                    const file = data.files[0];
                    console.log(`Folder '${folderName}' already exists with ID: ${file.id}`);
                    return file;
                } else {
                    // Folder doesn't exist, create it
                    const fileMetadata = {
                        name: folderName,
                        mimeType: 'application/vnd.google-apps.folder',
                        parents: [parentId],
                    };


                    const createResponse = await fetch(base, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        },
                        body: JSON.stringify(fileMetadata)
                    });

                    const data = await createResponse.json();

                    if (createResponse.status === 200) {
                        const file = data;
                        console.log(`Created Folder '${folderName}' with ID: ${file.id}`);
                        return file;
                    } else {
                        console.log('Error creating the folder, ' + createResponse);
                    }
                }
            } else {
                console.log('Error searching for the folder, ' + response);
            }

            console.log('File uploaded:', data);
        } catch (error) {
            console.error('Error uploading file:', error);
        }


    } catch (error) {
        console.error('Error creating/checking the folder:', error);
    }
}


async function saveToDrive(user: IUserInfo, groups: IGroup[]) {
    groups.forEach((group: IGroup) => {
        saveFile(user, group);
    });
}

async function saveFile(user: IUserInfo, group: IGroup) {

    // Get the __Glim folder (or create it if it doesn't exist)
    const folder = await createFile(user);

    const content = jsonToCsvRaw(group.Words);

    if (!folder) {
        console.log('Could not create or find the __Glim folder');
        return;
    }
    const shouldRefreshToken = checkIfTokenExpired(); // Implement your own logic to determine if token refresh is needed

    let accessToken = user.AccessToken;

    if (shouldRefreshToken) {
      // Call the token refresh function
      accessToken = await refreshAccessToken(user.AccessToken);
    }


    // const content = 'Hello, world!';
    const mimeType = 'text/css';

    const file = new File([content], `${group.Name}.txt`, { type: mimeType });

    const metadata = {
        name: file.name,
        mimeType: file.type,
        parents: [folder.id]
    };

    const url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';

    const body = new FormData();
    body.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    body.append('file', file);

    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        body: body
    })
        .then(response => response.json())
        .then(data => console.log('File uploaded:', data))
        .catch(error => console.error('Error uploading file:', error));
}


export { saveToDrive }