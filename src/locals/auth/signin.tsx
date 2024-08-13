import axios from "axios";
import { IUserInfo } from "../../interfaces/IUserInfo";
import { ITokenResponse } from "../../interfaces/Google/ITokenResponse";
import { LoginStatus } from "../../models/Enums";
import { IResponseObject } from "../../interfaces/AWS/IResponse";
import { PROJECT } from "../../constants/constants";
import { buildAWSPostRequest } from "../../models/AWS/AWSContent";
import { getAWSUserInfo } from "../../hooks/aws.lambda.hook";
import { User } from '../../models/User';

export const signin = async (user: IUserInfo) => {

    if (user.Login.Code) {
        try {
            // Define the request payload
            const requestPayload = {
                Project: PROJECT,
                Code: user.Login.Code,
                RedirectUri: user.Login.Redirect
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
    
                user.Login.LoginStatus = LoginStatus.Exchange;
    
                if (tokens) {
                    // Fetch user info based on the tokens
                    await getUserInfo(user, tokens);
                } else {
                    throw new Error('Invalid state parameter');
                }
                
            } catch (error: any) {
                if (error.response) {
                    console.error(`Error response: ${error.response.data}`);
                    return error.response.data;
                } else if (error.request) {
                    console.error(`Error request: ${error.request}`);
                    return "Network error, please try again later.";
                } else {
                    console.error(`Error: ${error.message}`);
                    return "An unexpected error occurred.";
                }
            }

            // Clean up the response string
           
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }

}

const getUserInfo = async (user: IUserInfo, tokens: ITokenResponse) => {
    // Assume this._oauth.GetUserInfoAsync is a function that takes an access token and returns user info
    const result = await getAWSUserInfo(tokens.access_token);

    const responseObject: IResponseObject = JSON.parse(result) as IResponseObject;

    User.SetAuth(user, responseObject.Data, tokens);

    user.Login.LoginStatus = LoginStatus.Done;

}