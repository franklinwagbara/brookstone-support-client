export const translateValueToID = (arg: object[] | null, value: string) => {
  const result = arg?.find(a => {
    return (
      a[value as never] === (value as unknown as string) ||
      Object.keys(a).map(key => {
        console.log(
          'a object:',
          a,
          'key: ',
          key,
          'value:',
          value,
          'object value at key:',
          a[key as never],
          'result compare:',
          a[key as never] === value
        );
        return a[key as never] === value;
      })
    );
  });

  console.log('result....', (result as any)._id as any);
  return (result as any)._id as any;
};
