import type { Post } from "~/service/entities/post"
import type { CompareFunc } from "."

export const comparePost: CompareFunc<Post> = (prev, next) =>
  prev.slug === next.slug
