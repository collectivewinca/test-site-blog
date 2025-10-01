'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import Image from '@/components/Image'
import { getBannerForPost } from '../app/lib/bannerUtils'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface ListLayoutProps {
  posts: CoreContent<Blog>[]
  title: string
  initialDisplayPosts?: CoreContent<Blog>[]
  pagination?: PaginationProps
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname()
  const basePath = pathname.split('/')[1]
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  return (
    <div className="space-y-2 pb-8 pt-6 md:space-y-5">
      <nav className="flex justify-between">
        {!prevPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!prevPage}>
            Previous
          </button>
        )}
        {prevPage && (
          <Link
            href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
            rel="prev"
          >
            Previous
          </Link>
        )}
        <span>
          {currentPage} of {totalPages}
        </span>
        {!nextPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!nextPage}>
            Next
          </button>
        )}
        {nextPage && (
          <Link href={`/${basePath}/page/${currentPage + 1}`} rel="next">
            Next
          </Link>
        )}
      </nav>
    </div>
  )
}

export default function ListLayout({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const [searchValue, setSearchValue] = useState('')
  const filteredBlogPosts = posts.filter((post) => {
    const searchContent = post.title + post.summary + post.tags?.join(' ')
    return searchContent.toLowerCase().includes(searchValue.toLowerCase())
  })

  // If initialDisplayPosts exist, display it if no searchValue is specified
  const displayPosts =
    initialDisplayPosts.length > 0 && !searchValue ? initialDisplayPosts : filteredBlogPosts

  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            {title}
          </h1>
          <div className="relative max-w-lg">
            <label>
              <span className="sr-only">Search articles</span>
              <input
                aria-label="Search articles"
                type="text"
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search articles"
                className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-900 dark:bg-gray-800 dark:text-gray-100"
              />
            </label>
            <svg
              className="absolute right-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <ul>
          {!filteredBlogPosts.length && 'No posts found.'}
          {displayPosts.map((post) => {
            const { path, date, title, summary, tags, images } = post
            return (
              <li key={path} className="py-4">
                <article>
                  <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <Link href={`/${path}`} aria-label={`Link to ${title}`}>
                      <Image
                        src={images && images.length > 0 ? images[0] : getBannerForPost(title)}
                        alt={`Blog banner for ${title}`}
                        width={800}
                        height={256}
                        className="w-full h-[45vh] sm:h-[70vh]  object-cover"
                        priority={true}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 sm:via-black/10 via-black/30   to-transparent">
                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                          <div className="mb-2">
                            <time dateTime={date} className="text-xs sm:text-sm text-gray-200">
                              {formatDate(date, siteMetadata.locale)}
                            </time>
                          </div>
                          <h3 className="text-lg sm:text-2xl font-bold leading-6 sm:leading-8 tracking-tight mb-2 sm:mb-3">
                            {title}
                          </h3>
                          <div className="flex flex-wrap mb-2 sm:mb-3">
                            {tags?.slice(0, 5).map((tag) => (
                              <span key={tag} className="mr-1 sm:mr-2 mb-1 px-2 sm:px-3 py-1 text-xs bg-black/40 text-white rounded-full border border-white/20">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <p className="text-gray-200 mb-3 sm:mb-4 line-clamp-2 text-sm sm:text-base">
                            {summary}
                          </p>
                          <span className="text-primary-400 hover:text-primary-300 font-medium text-sm sm:text-base">
                            Read more &rarr;
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
      {pagination && pagination.totalPages > 1 && !searchValue && (
        <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
      )}
    </>
  )
}
