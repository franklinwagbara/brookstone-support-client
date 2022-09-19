export const calculateCCM = (ca1: string, hte: string): number => {
  const numbers: number[] = [];

  if (ca1) numbers.push(parseFloat(ca1));
  if (hte) numbers.push(parseFloat(hte));

  if (numbers.length === 0) return '' as unknown as number;

  const result =
    numbers.reduce((prev, curr, index) => prev + curr) / numbers.length;
  return parseFloat(result.toFixed(2));
};
