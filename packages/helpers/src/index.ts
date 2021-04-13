import { Option, Func, Either } from '@tdallau/types';

export const isNumber = (num: number) => !isNaN(num);
export const isStringNumber = (num: string) => !isNaN(+num);

export const some = <T>(v: T): Option<T> => ({ kind: 'some', value: v});
export const none = <T>(): Option<T> => ({ kind: 'none'});

export const leftEither = <Left,Right>(v:Left): Either<Left,Right> => ({ kind: 'left', value: v });
export const rightEither = <Left,Right>(v:Right): Either<Left,Right> => ({ kind: 'right', value: v });

export const promisify = <R>(exec: Func<[resolve: Func<[v:R], void>, reject: Func<string, void>],void>): Promise<R> => new Promise(exec);

export const timer = async (ms: number) => promisify<void>((resolve, _reject) => setTimeout(resolve, ms));

