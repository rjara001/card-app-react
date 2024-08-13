export interface IResponseObject {
    message: string;
    Data: IGoogleUserInfo;
}

// Assuming GoogleUserInfo is defined as:
export interface IGoogleUserInfo {
    email: string;
    family_name: string;
    given_name: string;
    id: string;
    name: string;
    picture: string;
    verified_email: boolean;
}

export interface IApiResponseWrapper {
    Body : string
}