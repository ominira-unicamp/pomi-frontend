export function scrollElementIntoView(
  element: { scrollIntoView?: (options?: ScrollIntoViewOptions) => void },
  options: ScrollIntoViewOptions,
) {
  element.scrollIntoView?.(options)
}
