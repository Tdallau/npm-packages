import { HttpResponse, request } from "@nativescript/core/http";
import { RequestHistory } from "./requestHistory";

type BaseRequestProps = {
  target: string;
  headers?: { [key: string] : any };
  url?: string;
  saveInHistory?: boolean
}

type PostRequestProps = BaseRequestProps & { body: object }
type GetRequestProps = BaseRequestProps;

export class Http {
  private _baseUrl;
  private _headers = { 'Content-Type': 'application/json' };
  private _saveHistory: boolean;
  private _debugging: boolean;
  private _history: RequestHistory[] = [];

  public constructor(baseUrl: string, saveHistory: boolean = true, debugging: boolean = false) {
    this._baseUrl = baseUrl;
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

    if(response.statusCode >= 200 && response.statusCode < 300) {
      return response.content!.toJSON();
    }
  }

  private saveHistory(url: string, start: number, end: number, headers: { [key: string] : string } | undefined, body: object | undefined, response: HttpResponse) {
    const success = response.statusCode >= 200 && response.statusCode < 300;
    this._history.push({
      response: {
        body: success ? response.content!.toJSON() : undefined,
        headers: response.headers,
        statusCode: response.statusCode
      },
      responseSuccesStatus: success,
      timePassed: (end - start) / 1000,
      url: url,
      requestHeaders: headers,
      requestBody: body
    })
  }

  public get history() { return this._history };

  public async post<T>(props: PostRequestProps): Promise<T> {
    const url = `${props.url || this._baseUrl}${props.target}`;
    return this.request('POST', url,  props.saveInHistory ?? this._saveHistory, props.headers, props.body);
  }

  public async get<T>(props: GetRequestProps): Promise<T> {
    const url = `${props.url || this._baseUrl}${props.target}`;
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