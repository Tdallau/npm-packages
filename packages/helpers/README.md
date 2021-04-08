This package contains some helper functions i use in many project.
Some examples are:
```ts
  const isNum1 = isNumber(3);
  const isNum2 = isStringNumber('3');

  // creating a Option<string> instance from package @tdallau/types
  const some = some<string>('value');
  const none = none<string>();

 // creating a Either<string, number> instance from package @tdallau/types
  const left = leftEither<string, number>('value');
  const right = rightEither<string, number>('value');

  // using Func<string> from package @tdallau/types to create a promise<string>
  const p = promisify<string>((resolve, reject) => {
    if (1 == 1) {
      resolve('equil!!');
      return;
    }
    reject('somthing went wrong!!')
  })

  await timer(2000 /* ms */);
```