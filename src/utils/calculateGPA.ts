export const calculateGPA = (total: string): number => {
  const _total = parseFloat(total);

  if (!total) return '' as unknown as number;

  let result = (_total / 100) * 5;

  return parseFloat(result.toFixed(1));
};
