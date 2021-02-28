import { curry } from "ramda"
import type { ExcludeNullProps } from "@util-types"

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

export function excludeNullProps<T>(
  target: T | null | undefined
): ExcludeNullProps<T | undefined> {
  if (typeof target === `undefined`) {
    return target
  } else if (target === null) {
    return undefined
  }

  const excluded = {}
  Object.entries(target).forEach(([key, value]) => {
    // @ts-ignore
    excluded[key] = value !== null ? value : undefined
  })

  // @ts-ignore
  return excluded
}
