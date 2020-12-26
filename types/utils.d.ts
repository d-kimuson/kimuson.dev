export type ExcludeNull<T> = T extends null ? Exclude<T, null> | undefined : T

export type ExcludeNullProps<T> = {
  [K in keyof T]: ExcludeNull<T[K]>
}
