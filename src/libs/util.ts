export const recursiveReplace = (str: string, regExp: RegExp | string, replace: string): string => {
  if (typeof regExp === 'string') {
    regExp = new RegExp(regExp);
  }
  while (regExp.test(str)) {
    str = str.replace(regExp, replace);
  }
  return str;
};
