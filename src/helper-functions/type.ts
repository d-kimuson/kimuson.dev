export function toArg<T>(prop: T | null | undefined): T | undefined {
  return prop === null ? undefined : prop
}
