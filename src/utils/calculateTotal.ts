export const calculateTotal = (
  ccm: string,
  ca_2: string,
  fe: string,
  _class: number
): number => {
  const numbers: number[] = [];
  let result;

  const _ccm = parseFloat(ccm);
  const _ca_2 = parseFloat(ca_2);
  const _fe = parseFloat(fe);

  if (ccm) numbers.push(_ccm);
  if (ca_2) numbers.push(_ca_2);
  if (fe) numbers.push(_fe);

  if (numbers.length < 3) return '' as unknown as number;

  if (_class < 10) {
    result = ((numbers[0] + numbers[1]) / 2) * 0.3 + _fe * 0.7;
  } else {
    result = ((numbers[0] + numbers[1]) / 2) * 0.2 + (_fe ? _fe * 0.8 : 0);
  }

  return parseFloat(result.toFixed(2));
};
