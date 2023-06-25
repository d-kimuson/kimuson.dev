export const px = (value: number): string => `${value}px`

export const headerHeight = 60
export const footerHeight = 100
export const contentMinHeightStyle = `calc(100svh - (${px(headerHeight)} + ${px(
  footerHeight
)}))`
