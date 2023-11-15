import { Headers } from "undici-types";

export const defaultHeaders = {
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      }
}

export function stripPath(path: string) {
  return path.split("/").filter(item => item.length > 0);
}

export function takePath(path: string, namespace: string, skip: number = 1, take: number = 1) {
  
  let namespaces = path.substring(path.indexOf(namespace)).split("/");
  
  return namespaces.slice(skip, skip + 2);
}

export function stripQuery(query: string) {
  let queryArray = query.split("&");
  let queryObject: Record<string, unknown> = {};
  
  if (queryArray && queryArray.length >= 1) {
      queryArray[0] = queryArray[0].split("?")[1];

      queryArray.forEach((item) => {
          let [key, value] = item.split("=");
          queryObject[key] = parseQueryParamValue(value);
      })
  }
  
  return queryObject;
}

function parseQueryParamValue(value: string): any {
  const parsedNumber = parseFloat(value);
  if (!isNaN(parsedNumber)) {
    return parsedNumber;
  }

  if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
    return value.toLowerCase() === 'true';
  }

  return value;
}

export class BaseResponse extends Response {

  constructor(status: number, body: any, response?: ResponseInit) {
    super(JSON.stringify(body), response as unknown ?? {status:status, ...defaultHeaders})
  }

}