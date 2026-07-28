function parseValue(value) {
  const trimmed = value.trim()

  if (!trimmed) return ''

  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    return trimmed
      .slice(1, -1)
      .split(',')
      .map((item) => item.trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean)
  }

  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed)
  if (trimmed === 'true') return true
  if (trimmed === 'false') return false

  return trimmed.replace(/^['"]|['"]$/g, '')
}

export function parseMarkdown(source, path = '') {
  const normalized = source.replace(/\r\n/g, '\n')
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  const attributes = {}
  let content = normalized.trim()

  if (match) {
    match[1].split('\n').forEach((line) => {
      if (!line.trim() || line.trimStart().startsWith('#')) return

      const separator = line.indexOf(':')
      if (separator === -1) return

      const key = line.slice(0, separator).trim()
      const value = line.slice(separator + 1)
      attributes[key] = parseValue(value)
    })

    content = match[2].trim()
  }

  const filename = path.split('/').pop() || ''
  const fallbackSlug = filename.replace(/\.md$/, '')

  return {
    ...attributes,
    slug: attributes.slug || fallbackSlug,
    content,
    sourcePath: path,
  }
}

export function formatDate(value) {
  return String(value || '').replaceAll('-', '.')
}

