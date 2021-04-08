import { Option, Func } from '@tdallau/types';

export const isNumber = (num: number) => !isNaN(num);
export const isStringNumber = (num: string) => !isNaN(+num);

export const some = <T>(v: T): Option<T> => ({ kind: 'some', value: v});
export const none = <T>(): Option<T> => ({ kind: 'none'});

export const promisify = <R>(exec: Func<[resolve: Func<[v:R], void>, reject: Func<string, void>],void>): Promise<R> => new Promise(exec);

