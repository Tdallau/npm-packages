import { HttpResponse } from "@nativescript/core";

export type RequestHistory = {
  url: string;
  requestHeaders?: any;
  requestBody?: any;
  response: HttpResponse;
  responseSuccesStatus: boolean;
  timePassed: number;
}