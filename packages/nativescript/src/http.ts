import { HttpResponse, request } from "@nativescript/core/http";
import { RequestHistory } from "./requestHistory";

type BaseRequestProps = {
  target: string;
  headers?: { [key: string] : any };
  url?: string;
  saveInHistory?: boolean;
}

type PostRequestProps = BaseRequestProps & { body?: object };
type GetRequestProps = BaseRequestProps & { query?: object };

export class Http {
  private _baseUrl;
  private _headers = { 'Content-Type': 'application/json' };
  private _saveHistory: boolean;
  private _debugging: boolean;
  private _history: RequestHistory[] = [];

  public constructor(baseUrl: string, baseHeaders: any = {}, saveHistory: boolean = true, debugging: boolean = false) {
    this._baseUrl = baseUrl;
    this._headers = {
      ...this._headers,
      ...baseHeaders
    }
    this._debugging = debugging;
    this._saveHistory = saveHistory;
  }

  private async request(method: 'POST' | 'GET' | 'PUT' | 'DELETE', url: string, saveInHistory = this._saveHistory, headers: { [key: string] : string } | undefined = undefined, body: object | undefined = undefined) {
    const start = new Date().valueOf();
    const allHeaders = headers ? { ...this._headers, ...headers } : this._headers;
    if(this._debugging) console.log(`Sending request to ${url}`);
    const response = await request({
      method: method,
      url,
      content: body ? JSON.stringify(body) : undefined,
      headers: allHeaders
    });
    const end = new Date().valueOf();
    if(this._debugging) console.log(`Request finished in ${(end - start) / 1000} seconds`);
    if(this._debugging) console.log(`the response status code is ${response.statusCode}`);
    if(this._saveHistory && saveInHistory) this.saveHistory(url, start, end, allHeaders, body, response);

    const content = response?.content?.toJSON();
    console.log(content);
    console.log('full', response.statusCode >= 200 && response.statusCode < 300, ((content === undefined || content === null ) || (content.httpStatus === undefined || content.httpStatus === null || content.httpStatus.success === true)));
    console.log('right', (content === undefined || content === null ), (content.httpStatus === undefined || content.httpStatus === null || content.httpStatus.success === true))
    if(response.statusCode >= 200 && response.statusCode < 300 && ((content === undefined || content === null ) || (content.httpStatus === undefined || content.httpStatus === null || content.httpStatus.success === true))) {
      return content
    }
    let errBody = undefined;
    errBody = response.content?.toJSON();
    if(!errBody) {
      throw new Error(`${method} request to ${url} went wrong!\n status code: ${response.statusCode}`);
    }
    throw new Error(`${method} request to ${url} went wrong: \n${errBody.Error || errBody.error}\n status code: ${response.statusCode}.`);
  }

  private saveHistory(url: string, start: number, end: number, headers: { [key: string] : string } | undefined, body: object | undefined, response: HttpResponse) {
    const content = response?.content?.toJSON();
    const success = response.statusCode >= 200 && response.statusCode < 300 && ((content === undefined || content === null ) || (content.success === true || content.success === undefined || content.success === null));
    this._history.push({
      response: {
        body: content,
        headers: response.headers,
        statusCode: response.statusCode,
        success
      },
      timePassed: (end - start) / 1000,
      url: url,
      requestHeaders: headers,
      requestBody: body
    })
  }

  public get history() { return this._history };

  private createQueryString(query: object): string {
    const keys = Object.keys(query);
    let string = '';

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if(i !== 0) {
        string += `&${key}=${query[key]}`;
      } else {
        string = `?${key}=${query[key]}`;
      }
      
    }

    return string;
  }

  public async post<T>(props: PostRequestProps): Promise<T> {
    const url = `${props.url || this._baseUrl}${props.target}`;
    return this.request('POST', url,  props.saveInHistory ?? this._saveHistory, props.headers, props.body);
  }

  public async get<T>(props: GetRequestProps): Promise<T> {
    let qString = '';
    if(props.query) {
      qString = this.createQueryString(props.query);
    }
    const url = `${props.url || this._baseUrl}${props.target}${qString}`;
    return this.request('GET', url, props.saveInHistory ?? this._saveHistory, props.headers);
  }

  public async put<T>(props: PostRequestProps): Promise<T> {
    const url = `${props.url || this._baseUrl}${props.target}`;
    return this.request('PUT', url, props.saveInHistory ?? this._saveHistory, props.headers, props.body);
  }

  public async delete<T>(props: GetRequestProps): Promise<T> {
    const url = `${props.url || this._baseUrl}${props.target}`;
    return this.request('DELETE', url, props.saveInHistory ?? this._saveHistory, props.headers);
  }
}