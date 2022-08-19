import { curry } from "ramda"
import type { ExcludeNullProps } from "types/utils"

export const replaceAll = curry(
  (baseString: string, beforeString: string, afterString: string): string =>
    baseString.split(beforeString).join(afterString)
)

export const copy = (content: string): void => {
  const el = document.createElement(`textarea`)
  el.value = content
  el.setAttribute(`readonly`, ``)
  el.style.position = `absolute`
  el.style.left = `-9999px`
  document.body.appendChild(el)
  el.select()
  document.execCommand(`copy`)
  document.body.removeChild(el)
}

export function excludeNull<T>(prop: T | null | undefined): T | undefined {
  return prop === null ? undefined : prop
}

export function excludeNullProps<T extends Record<string, unknown>>(
  target: T
): ExcludeNullProps<T | undefined> {
  return Object.entries(target).reduce(
    (s: Partial<ExcludeNullProps<T | undefined>>, [key, value]) => {
      // @ts-expect-error -- 型解決ができてないだけ
      s[key] = value
      return s
    },
    {}
  ) as ExcludeNullProps<T | undefined>
}
