export const replaceAll = (
  baseString: string,
  beforeString: string,
  afterString: string
): string => baseString.split(beforeString).join(afterString)
