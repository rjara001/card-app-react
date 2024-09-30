import axios from "axios";
import { ITokenResponse } from "../../interfaces/Google/ITokenResponse";
import { IResponseObject } from "../../interfaces/AWS/IResponse";
import { PROJECT } from "../../constants/constants";
import { buildAWSPostRequest } from "../../models/AWS/AWSContent";
import { getAWSUserInfo } from "../../hooks/aws.lambda.hook";

export const signin = async (code: string, redirect: string): Promise<IResponseObject> => {

    if (code) {
        try {
            // Define the request payload
            const requestPayload = {
                Project: PROJECT,
                Code: code,
                RedirectUri: redirect
            };

            const url = "https://j70plrsr9c.execute-api.us-east-1.amazonaws.com/dev/Exchange";

            const request = buildAWSPostRequest(url, requestPayload);

            try {
                // Exchange code for tokens
                const response = await axios.post(url, request, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                let resultExchange = response.data;

                resultExchange = resultExchange.trim().replace(/\\n/g, "").replace(/\\"/g, "\"");

                // Parse the token response
                const tokens: ITokenResponse = JSON.parse(resultExchange);

                if (tokens) {
                    // Fetch user info based on the tokens
                    return await getUserInfo(tokens);
                } else {
                    throw new Error('Invalid state parameter');
                }

            } catch (error: any) {
                if (error.response) {
                    console.error(`Error response: ${error.response.data}`);
                    return Promise.reject();
                } else if (error.request) {
                    console.error(`Error request: ${error.request}`);
                    return Promise.reject("Network error, please try again later.");
                } else {
                    console.error(`Error: ${error.message}`);
                    return Promise.reject("An unexpected error occurred.");
                }
            }
        } catch (error) {
            console.error('An error occurred:', error);
            return Promise.reject("An error occurred while processing the request.");
        }
    } else {
        // Handle case where `code` is falsy
        return Promise.reject("Invalid code parameter.");
    }
    
};


const getUserInfo = async (tokens: ITokenResponse) => {
    // Assume this._oauth.GetUserInfoAsync is a function that takes an access token and returns user info
    const result = await getAWSUserInfo(tokens.access_token);

    const responseObject: IResponseObject = JSON.parse(result) as IResponseObject;

    responseObject.Data.tokens = tokens;

    return responseObject;
}