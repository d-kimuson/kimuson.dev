export type Loading = {
  isLoading: true
}

export type Loaded<T> = {
  isLoading: false
  value: T
}

export type Loadable<T> = Loading | Loaded<T>

export const loading = (): Loading => ({
  isLoading: true,
})

export const loaded = <T>(value: T): Loaded<T> => ({
  isLoading: false,
  value,
})
