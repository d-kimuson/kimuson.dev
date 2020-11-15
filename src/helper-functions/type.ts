export function toUndefinedOrT<T>(prop: T | null | undefined): T | undefined {
  return prop === null ? undefined : prop
}
