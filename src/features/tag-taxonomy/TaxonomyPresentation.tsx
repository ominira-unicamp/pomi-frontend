export function formatTagCount(count: number) {
  return `${count} ${count === 1 ? 'tag' : 'tags'}`
}
