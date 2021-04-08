import { request } from "@nativescript/core/http";

type BaseRequestProps = {
  target: string;
  headers?: { [key: string] : any };
  url?: string;
}

type PostRequestProps = BaseRequestProps & { body: object }
type GetRequestProps = BaseRequestProps;

export class Http {
  private _baseUrl;
  private _headers = {
    'Content-Type': 'application/json'
  }

  public constructor(baseUrl: string) {
    this._baseUrl = baseUrl;
  }

  private async request(method: 'POST' | 'GET', url: string, headers: { [key: string] : string } | undefined = undefined, body: object | undefined = undefined) {
    const response = await request({
      method: method,
      url,
      content: body ? JSON.stringify(body) : undefined,
      headers: headers ? { ...this._headers, ...headers } : this._headers
    })

    if(response.statusCode >= 200 && response.statusCode < 300) {
      return response.content!.toJSON();
    }
  }

  async post<T>(props: PostRequestProps): Promise<T> {
    const url = `${props.url || this._baseUrl}${props.target}`;
    return this.request('POST', url, props.headers, props.body);
  }

  async get<T>(props: GetRequestProps): Promise<T> {
    const url = `${props.url || this._baseUrl}${props.target}`;
    return this.request('GET', url, props.headers);
  }
}