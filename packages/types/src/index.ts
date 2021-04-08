export type Either<TLeft,TRight> = { kind: 'left', value: TLeft } |  { kind: 'right', value: TRight }
export type Option<T> = { kind: 'some', value: T } | { kind: 'none' };

export type Func<A= unknown[], R = unknown> = (...args: A extends unknown[] ? A : [A]) => R;
export type Action<R> = Func<[],R>;
