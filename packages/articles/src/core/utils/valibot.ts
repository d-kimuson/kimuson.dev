import * as v from "valibot";

export const logValiError = (
  error: unknown
): error is v.ValiError<
  | v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>
  | v.BaseSchemaAsync<unknown, unknown, v.BaseIssue<unknown>>
> => {
  if (!(error instanceof v.ValiError)) {
    return false;
  }

  console.error(error.message);

  for (const issue of error.issues) {
    console.error(issue.path, error.issues);
  }

  console.error(error.stack);
  return true;
};
