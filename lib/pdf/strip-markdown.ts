/**
 * Strip simple markdown for plain-text PDF (e.g. **bold** -> bold).
 */
export function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
