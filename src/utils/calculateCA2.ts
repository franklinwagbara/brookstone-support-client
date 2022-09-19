export const calculateCA2 = (
  wk5: string,
  wk6: string,
  wk7: string,
  wk8: string,
  wk9: string
): number => {
  const numbers: number[] = [];

  if (wk5) numbers.push(parseFloat(wk5));
  if (wk6) numbers.push(parseFloat(wk6));
  if (wk7) numbers.push(parseFloat(wk7));
  if (wk8) numbers.push(parseFloat(wk8));
  if (wk9) numbers.push(parseFloat(wk9));

  if (numbers.length === 0) return '' as unknown as number;

  const result =
    numbers.reduce((prev, curr, index) => prev + curr) / numbers.length;
  return parseFloat(result.toFixed(2));
};
