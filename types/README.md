This package contains some typescript types i use in many project.
Some examples are:
```ts
  const o1: Option<string> = {
    kind: 'some',
    value: 'hello i am an option value'
  }

  const o2: Option<string> = {
    kind: 'none',
  }

  const e1: Either<string, number> = { kind: 'left', value: 'value' }
  const e2: Either<string, number> = { kind: 'right', value: 2 }

  const f1: Func<number, number> = (x) => x * 2;
  const f2: Func<[number, number], number> = (a, b) => a + b;
  const f3: Func<[a:number, b:number]> = (a,b) => a * b;
  const f4: Action<string> = () => 'I am a function without params';
```