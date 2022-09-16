import {IRequestParams} from '../interfaces/IRequestParams';

export const generateQueryStringFromObject = (arg: IRequestParams) => {
  let result = '?';
  const keys = Object.keys(arg);

  for (let i = 0; i < keys.length; i++) {
    if (i > 0 && arg[keys[i]]) {
      result += '&';
    }
    if (arg[keys[i]]) {
      result += `${keys[i]}=${arg[keys[i]]}`;
    }
  }
  return result;
};
