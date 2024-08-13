import { TypeRequest } from "../constants/type-request";
import { IAWSUser } from "../interfaces/AWS/IAWSUser";
import { IApiResponseWrapper } from "../interfaces/AWS/IResponse";
import { IUserInfo } from "../interfaces/IUserInfo";
import { buildAWSPostRequest } from "../models/AWS/AWSContent";

export const getAWSUserInfo = async (accessToken: string) => {
    console.log("getUserInfo");

    const apiUrl = "https://lj9c4l658h.execute-api.us-east-1.amazonaws.com/dev/GetUserInfo";
    const jsonContent = buildAWSPostRequest(apiUrl, accessToken);

    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: headers,
            body: jsonContent,
        });

        if (response.ok) {
            const content = await response.text();
            console.log(`Response: ${content}`);
            return content;
        } else {
            throw new Error(`Request to AWS API failed with status code ${response.status}`);
        }
    } catch (error) {
        console.error(`An error occurred: ${error}`);
        return "";
    }
}

export const getAWSData = async (user: IUserInfo): Promise<IAWSUser> => {
    console.log("GetData");

    // TODO: Put in settings file
    const apiUrl = "GetData";

    const data = {
        TypeRequest: TypeRequest.RefreshToken,
        User: {
            UserToken: {
                RefreshToken: user.RefreshToken
            }
        }, // Replace with actual function to get the session user
        // Add other properties as needed
    };

    const json = JSON.stringify(data);

    const jsonContent = buildAWSPostRequest(apiUrl, json);

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: jsonContent,
        });

        if (response.ok) {
            const contentResponse = await response.text();
            const responseObject: IApiResponseWrapper = JSON.parse(contentResponse);
            const user: IAWSUser = JSON.parse(responseObject.Body);
            return user;
        } else {
            // Handle non-successful responses
            console.error('Failed to fetch data:', response.statusText);
        }
    } catch (error) {
        console.error('Error occurred while fetching data:', error);
    }

    return {
        UserToken: {
            Token: ''
        }
    }
}