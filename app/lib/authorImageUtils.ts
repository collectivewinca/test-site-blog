import PUBLIC_AUTHOR_IMAGES from '../../publicAuthorImages'

// Deterministic selection of an author image based on a seed (e.g., post title)
type AuthorEntry = string | { path: string; name?: string; designation?: string }

function getEntries(): { path: string; name?: string; designation?: string }[] {
  if (!Array.isArray(PUBLIC_AUTHOR_IMAGES)) return []
  return (PUBLIC_AUTHOR_IMAGES as AuthorEntry[]).map((entry) =>
    typeof entry === 'string' ? { path: entry } : entry
  )
}

export function getAuthorImageForPost(title: string): string | null {
  const entries = getEntries()
  if (entries.length === 0) return null
  if (!title || typeof title !== 'string' || title.trim().length === 0) return entries[0].path

  let hash = 0
  const cleanTitle = title.trim()
  for (let i = 0; i < cleanTitle.length; i++) {
    const char = cleanTitle.charCodeAt(i)
    hash = ((hash << 5) - hash + char) >>> 0
  }
  const index = hash % entries.length
  return entries[index].path
}

// Returns a minimal profile using title-hash image and the provided author name
export function getAuthorProfile(
  title: string,
  authorName?: string
): { imagePath: string | null; displayName: string; designation?: string } {
  const entries = getEntries()
  if (entries.length === 0) return { imagePath: null, displayName: authorName || 'Author' }

  let hash = 0
  const cleanTitle = (title || '').trim()
  for (let i = 0; i < cleanTitle.length; i++) {
    const char = cleanTitle.charCodeAt(i)
    hash = ((hash << 5) - hash + char) >>> 0
  }
  const index = entries.length === 0 ? 0 : hash % entries.length
  const chosen = entries[index]

  const displayName = chosen.name || authorName || 'Author'
  return { imagePath: chosen.path, displayName, designation: chosen.designation }
}

export default getAuthorImageForPost


