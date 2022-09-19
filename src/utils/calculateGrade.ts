export const calculateGrade = (total: string): string => {
  const _total = parseFloat(total);
  let result;

  if (!total) return '';

  if (_total > 91) result = 'A*';
  else if (_total > 80) result = 'A';
  else if (_total > 70) result = 'B';
  else if (_total > 60) result = 'C';
  else if (_total > 50) result = 'D';
  else if (_total > 40) result = 'E';
  else result = 'F';

  console.log('total', _total, 'result', result);

  return result;
};
