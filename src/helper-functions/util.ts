// export const replaceAll = (
//   baseString: string,
//   beforeString: string,
//   afterString: string
// ): string => baseString.replace(new RegExp(beforeString, `g`), afterString)
export const replaceAll = (
  baseString: string,
  beforeString: string,
  afterString: string
): string => baseString.split(beforeString).join(afterString)
