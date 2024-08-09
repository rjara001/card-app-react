type BodyType = object | string;

interface BodyObject {
  version: string;
  routeKey: string;
  rawPath: string;
  rawQueryString: string;
  headers: {
    ContentType: string;
  };
  requestContext: {
    httpMethod: string;
    path: string;
    protocol: string;
    stage: string;
  };
  body: string;
  isBase64Encoded: boolean;
}

export function buildAWSPostRequest(url: string, body: BodyType): string {
  // Extract just the path part of the URL
  const urlPath = new URL(url).pathname;

  const bodyObject: BodyObject = {
    version: "2.0",
    routeKey: `POST ${urlPath}`,
    rawPath: urlPath,
    rawQueryString: "",
    headers: {
      ContentType: "application/json",
    },
    requestContext: {
      httpMethod: "POST",
      path: urlPath,
      protocol: "HTTP/1.1",
      stage: "$default",
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
    isBase64Encoded: false,
  };

  return JSON.stringify(bodyObject);
}
