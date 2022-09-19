export const calculateCA1 = (
  wk1: string,
  wk2: string,
  wk3: string,
  wk4: string
): number => {
  const numbers: number[] = [];

  if (wk1) numbers.push(parseFloat(wk1));
  if (wk2) numbers.push(parseFloat(wk2));
  if (wk3) numbers.push(parseFloat(wk3));
  if (wk4) numbers.push(parseFloat(wk4));

  if (numbers.length === 0) return '' as unknown as number;

  const result =
    numbers.reduce((prev, curr, index) => prev + curr) / numbers.length;
  return parseFloat(result.toFixed(2));
};
