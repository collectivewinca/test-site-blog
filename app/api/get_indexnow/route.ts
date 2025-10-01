import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { promises as fs } from 'fs'

type IndexNowPayload = {
  host: string
  key: string
  keyLocation: string
  urlList: string[]
}

async function findIndexNowKey(publicDir: string): Promise<{ key: string; fileName: string }> {
  const directoryEntries = await fs.readdir(publicDir, { withFileTypes: true })

  // Prefer files that look like an IndexNow key file: <key>.txt with the same key inside
  for (const entry of directoryEntries) {
    if (!entry.isFile()) continue
    if (!entry.name.toLowerCase().endsWith('.txt')) continue

    const filePath = path.join(publicDir, entry.name)
    const raw = await fs.readFile(filePath, 'utf8')
    const content = raw.trim()
    const baseName = entry.name.replace(/\.txt$/i, '')

    // A loose validation for keys: 16-64 chars, alphanumerics and dashes only
    const looksLikeKey = /^[A-Za-z0-9-]{16,64}$/.test(content)

    if (looksLikeKey && (content === baseName || /^[A-Za-z0-9-]{16,64}$/.test(baseName))) {
      return { key: content, fileName: entry.name }
    }
  }

  // Fallback: look for a file named indexnow*.txt and use its contents
  for (const entry of directoryEntries) {
    if (!entry.isFile()) continue
    if (!entry.name.toLowerCase().endsWith('.txt')) continue
    if (!entry.name.toLowerCase().includes('indexnow')) continue

    const filePath = path.join(publicDir, entry.name)
    const content = (await fs.readFile(filePath, 'utf8')).trim()
    return { key: content, fileName: entry.name }
  }

  throw new Error('IndexNow key file not found in public directory')
}

async function parseSitemapUrls(xml: string): Promise<string[]> {
  const urls: string[] = []

  // Simple extraction of <loc>...</loc> entries
  const locRegex = /<loc>\s*([^<\s]+)\s*<\/loc>/gim
  let match: RegExpExecArray | null
  while ((match = locRegex.exec(xml)) !== null) {
    const url = match[1].trim()
    if (url) urls.push(url)
  }
  return Array.from(new Set(urls))
}

function getOriginAndHost(request: NextRequest): { origin: string; host: string } {
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https'
  const forwardedHost = request.headers.get('x-forwarded-host')
  const hostHeader = request.headers.get('host')
  const host = (forwardedHost || hostHeader || '').split(',')[0].trim()
  const origin = `${forwardedProto}://${host}`
  return { origin, host }
}

export async function POST(request: NextRequest) {
  try {
    const { origin, host } = getOriginAndHost(request)
    const publicDir = path.join(process.cwd(), 'public')

    // Load IndexNow key from public folder
    const { key, fileName } = await findIndexNowKey(publicDir)

    // Read URLs from live sitemap.xml
    const sitemapUrl = `${origin}/sitemap.xml`
    const sitemapRes = await fetch(sitemapUrl, {
      method: 'GET',
      headers: { Accept: 'application/xml, text/xml;q=0.9, */*;q=0.8' },
      cache: 'no-store',
    })
    if (!sitemapRes.ok) {
      return NextResponse.json(
        { success: false, message: 'Failed to fetch sitemap.xml', indexedUrls: [] },
        { status: 502 }
      )
    }
    const sitemapXml = await sitemapRes.text()
    const urlList = await parseSitemapUrls(sitemapXml)
    if (urlList.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No URLs found in sitemap.xml', indexedUrls: [] },
        { status: 422 }
      )
    }

    // Ensure only URLs from the same host are sent
    const filteredUrls = urlList.filter((url) => {
      try {
        const u = new URL(url)
        return u.host === host
      } catch {
        return false
      }
    })

    if (filteredUrls.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No URLs match current host', indexedUrls: [] },
        { status: 422 }
      )
    }

    // Construct payload for IndexNow
    const payload: IndexNowPayload = {
      host,
      key,
      keyLocation: `${origin}/${fileName}`,
      urlList: filteredUrls,
    }

    // Send to IndexNow endpoint
    const indexNowEndpoint = 'https://api.indexnow.org/indexnow'
    const response = await fetch(indexNowEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: 'IndexNow request failed', indexedUrls: filteredUrls },
        { status: response.status }
      )
    }

    return NextResponse.json({ success: true, message: 'Indexed successfully', indexedUrls: filteredUrls })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ success: false, message, indexedUrls: [] }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { origin, host } = getOriginAndHost(request)

    const publicDir = path.join(process.cwd(), 'public')
    const { key, fileName } = await findIndexNowKey(publicDir)

    const sitemapUrl = `${origin}/sitemap.xml`
    const sitemapRes = await fetch(sitemapUrl, {
      method: 'GET',
      headers: { Accept: 'application/xml, text/xml;q=0.9, */*;q=0.8' },
      cache: 'no-store',
    })
    if (!sitemapRes.ok) {
      return NextResponse.json(
        { success: false, message: `Failed to fetch sitemap.xml` },
        { status: 502 }
      )
    }

    const sitemapXml = await sitemapRes.text()
    const urlList = await parseSitemapUrls(sitemapXml)

    const filteredUrls = urlList.filter((url) => {
      try {
        const u = new URL(url)
        return u.host === host
      } catch {
        return false
      }
    })

    if (filteredUrls.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No URLs match current host', indexedUrls: [] },
        { status: 422 }
      )
    }

    const payload: IndexNowPayload = {
      host,
      key,
      keyLocation: `${origin}/${fileName}`,
      urlList: filteredUrls,
    }

    const indexNowEndpoint = 'https://api.indexnow.org/indexnow'
    const response = await fetch(indexNowEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    })
    
    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: 'IndexNow request failed', indexedUrls: filteredUrls },
        { status: response.status }
      )
    }

    return NextResponse.json({ success: true, message: 'Indexed successfully', indexedUrls: filteredUrls })
  } catch (error: unknown) {
    const message = error instanceof Error ? `${error.message}` : 'Unknown error'
    return NextResponse.json({ success: false, message, indexedUrls: [] }, { status: 500 })
  }
}


