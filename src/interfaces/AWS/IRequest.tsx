
export interface IRequestObject {
    version: string;
    routeKey: string;
    rawPath: string;
    rawQueryString: string;
    headers: { [key: string]: string };
    requestContext: IRequestContext;
    body: string;
    isBase64Encoded: boolean;
}

export interface IRequestContext {
    httpMethod: string;
    path: string;
    protocol: string;
    stage: string;
}
