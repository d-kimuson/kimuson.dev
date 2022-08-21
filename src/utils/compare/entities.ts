import type { CompareFunc } from "."
import type { Post } from "~/types/post"

export const comparePost: CompareFunc<Post> = (prev, next) =>
  prev.slug === next.slug
