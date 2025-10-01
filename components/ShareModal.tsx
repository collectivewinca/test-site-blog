'use client'

import React, { useEffect, useState } from 'react'
import { X as CloseX, Copy as CopyIcon, Check as CheckIcon } from 'lucide-react'
import {
  WhatsappIcon,
  FacebookIcon,
  LinkedinIcon,
  TelegramIcon,
  RedditIcon,
  EmailIcon,
  PinterestIcon,
} from 'react-share'

type ShareModalProps = {
  isOpen: boolean
  onClose: () => void
  title: string
  url: string
  summary?: string
  image?: string
}

export default function ShareModal({ isOpen, onClose, title, url, summary, image }: ShareModalProps) {
  const [copied, setCopied] = useState(false)

  const BRAND_COLORS: Record<string, string> = {
    whatsapp: '#25D366',
    facebook: '#1877F2',
    x: '#000000',
    linkedin: '#0A66C2',
    telegram: '#229ED9',
    pinterest: '#E60023',
    reddit: '#FF4500',
    email: '#1F2937',
    sms: '#34C759',
    threads: '#000000',
  }

  useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(id)
  }, [copied])

  if (!isOpen) return null

  const shareText = `Check out this blog post: \n\n${title}\n\n${url}`

  const openWindow = (shareUrl: string) => {
    window.open(shareUrl, '_blank', 'noopener,noreferrer')
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
    } catch (_) {
      setCopied(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60"
        role="button"
        tabIndex={0}
        aria-label="Close share modal"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onClose()
        }}
      />

      <div className="relative w-[92vw] max-w-md overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-neutral-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 p-6 dark:border-neutral-700">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Share Blog Post</h3>
          <button
            onClick={onClose}
            aria-label="Close share modal"
            className="rounded-lg p-2 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <CloseX className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 p-6">
          {/* Blog Info */}
          <div className="space-y-2">
            <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">{title}</h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Share this blog post with others</p>
          </div>

          {/* URL Display */}
          <div className="space-y-3">
            <label htmlFor="share-url" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Blog URL</label>
            <div className="flex items-center gap-2">
              <input
                id="share-url"
                value={url}
                readOnly
                className="flex-1 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-900 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
              />
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 rounded-lg bg-neutral-900 px-3 py-2 text-neutral-100 transition-colors hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
              >
                {copied ? (
                  <>
                    <CheckIcon className="h-4 w-4" />
                    <span className="text-xs">Copied!</span>
                  </>
                ) : (
                  <>
                    <CopyIcon className="h-4 w-4" />
                    <span className="text-xs">Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Share Options */}
          <div className="flex flex-col items-center gap-y-3">
            <span className="text-md font-medium text-neutral-700 dark:text-neutral-300">Share on Social Media</span>
            <div className="grid grid-cols-5 gap-7">
              <button
                onClick={() => openWindow(`https://wa.me/?text=${encodeURIComponent(shareText)}`)}
                aria-label="Share on WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: BRAND_COLORS.whatsapp }}
              >
                <WhatsappIcon size={30} round={false} bgStyle={{ fill: 'transparent' }} iconFillColor="#FFFFFF" />
              </button>

              <button
                onClick={() => openWindow(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(shareText)}`)}
                aria-label="Share on Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: BRAND_COLORS.facebook }}
              >
                <FacebookIcon size={36} round={false} bgStyle={{ fill: 'transparent' }} iconFillColor="#FFFFFF" />
              </button>

              <button
                onClick={() => openWindow(`https://x.com/intent/post?text=${encodeURIComponent(`Check out this blog post: ${title}\n\n${url}`)}`)}
                aria-label="Share on X (Twitter)"
                className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: BRAND_COLORS.x }}
              >
                <XGlyph />
              </button>

              <button
                onClick={() => openWindow(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`)}
                aria-label="Share on LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: BRAND_COLORS.linkedin }}
              >
                <LinkedinIcon size={34} round={false} bgStyle={{ fill: 'transparent' }} iconFillColor="#FFFFFF" />
              </button>

              <button
                onClick={() => openWindow(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`)}
                aria-label="Share on Telegram"
                className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: BRAND_COLORS.telegram }}
              >
                <TelegramIcon size={26} round={false} bgStyle={{ fill: 'transparent' }} iconFillColor="#FFFFFF" />
              </button>

              <button
                onClick={() => openWindow(`https://www.threads.net/intent/post?text=${encodeURIComponent(shareText)}`)}
                aria-label="Share on Threads"
                className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: BRAND_COLORS.threads }}
              >
                <ThreadsGlyph />
              </button>

              <button
                onClick={() => openWindow(
                  image
                    ? `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(image)}&description=${encodeURIComponent(title)}`
                    : `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(title)}`
                )}
                aria-label="Share on Pinterest"
                className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: BRAND_COLORS.pinterest }}
              >
                <PinterestIcon size={36} round={false} bgStyle={{ fill: 'transparent' }} iconFillColor="#FFFFFF" />
              </button>

              <button
                onClick={() => openWindow(`https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`)}
                aria-label="Share on Reddit"
                className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: BRAND_COLORS.reddit }}
              >
                <RedditIcon size={34} round={false} bgStyle={{ fill: 'transparent' }} iconFillColor="#FFFFFF" />
              </button>

              <button
                onClick={() => openWindow(`mailto:?subject=${encodeURIComponent(`Check out this blog post: ${title}`)}&body=${encodeURIComponent(shareText)}`)}
                aria-label="Share via Email"
                className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: BRAND_COLORS.email }}
              >
                <EmailIcon size={36} round={false} bgStyle={{ fill: 'transparent' }} iconFillColor="#FFFFFF" />
              </button>

              <button
                onClick={() => openWindow(`sms:?body=${encodeURIComponent(shareText)}`)}
                aria-label="Share via SMS"
                className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: BRAND_COLORS.sms }}
              >
                <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20 2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4l4 4 4-4h4a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Zm-2 12H6v-2h12v2Zm0-3H6V9h12v2Zm0-3H6V6h12v2Z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function XGlyph() {
  return (
    <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function ThreadsGlyph() {
  return (
    <svg className="h-5 w-5 text-white" viewBox="0 0 192 192" fill="currentColor" aria-hidden="true">
      <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z" />
    </svg>
  )
}


