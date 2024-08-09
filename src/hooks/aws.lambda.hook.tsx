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
