export function isWebLink(href: string): boolean {
  return !href.startsWith("mailto:");
}
