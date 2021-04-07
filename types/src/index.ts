type Some<T> = { kind: 'some', value: T };
type None = { kind: 'none' };

export type Option<T> = Some<T> | None;