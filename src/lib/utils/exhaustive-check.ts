export const exhaustiveCheck = (value: never): never => {
  throw new Error(`exhaustiveCheck: ${value}`);
};
