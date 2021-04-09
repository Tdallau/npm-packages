export type RequestHistory = {
  url: string;
  requestHeaders?: any;
  requestBody?: any;
  response: {
    body?: any,
    headers?: any,
    statusCode: number
  };
  responseSuccesStatus: boolean;
  timePassed: number;
}