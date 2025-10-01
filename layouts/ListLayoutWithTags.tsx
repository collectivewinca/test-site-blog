'use client'

import { usePathname } from 'next/navigation'
import { slug } from 'github-slugger'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import Image from '@/components/Image'
import tagData from 'app/tag-data.json'
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
            href={currentPage - 1 === 1 ? `${pathname}/` : `${pathname}/?page=${currentPage - 1}`}
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
          <Link href={`${pathname}/?page=${currentPage + 1}`} rel="next">
            Next
          </Link>
        )}
      </nav>
    </div>
  )
}

export default function ListLayoutWithTags({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const pathname = usePathname()
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])

  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  return (
    <>
            <div>
        <div className="pb-6 pt-6">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            {title}
          </h1>
        </div>
        <div className="flex flex-col lg:flex-row lg:space-x-4">
          <div className="hidden h-full max-h-screen min-w-[320px] max-w-[320px] flex-wrap overflow-auto rounded bg-gray-50 pt-5 shadow-md dark:bg-gray-900/70 dark:shadow-gray-800/40 lg:flex">
            <div className="px-6 py-4">
              {pathname.startsWith('/blog') ? (
                <h3 className="font-bold uppercase text-primary-500">All Posts</h3>
              ) : (
                <Link
                  href={`/blog`}
                  className="font-bold uppercase text-gray-700 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-500"
                >
                  All Posts
                </Link>
              )}
              <ul>
                {sortedTags.map((t) => {
                  return (
                    <li key={t} className="my-3">
                      {decodeURI(pathname.split('/tags/')[1]) === slug(t) ? (
                        <h3 className="inline px-3 py-2 text-sm font-bold uppercase text-primary-500">
                          {`${t} (${tagCounts[t]})`}
                        </h3>
                      ) : (
                        <Link
                          href={`/tags/${slug(t)}`}
                          className="px-3 py-2 text-sm font-medium uppercase text-gray-500 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-500"
                          aria-label={`View posts tagged ${t}`}
                        >
                          {`${t} (${tagCounts[t]})`}
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
          <div className="w-full">
            <ul>
              {displayPosts.map((post) => {
                const { path, date, title, summary, tags, images } = post
                return (
                  <li key={path} className="py-2">
                    <article>
                    <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <Link href={`/${path}`} aria-label={`Link to ${title}`}>
                        <Image
                          src={images && images.length > 0 ? images[0] : getBannerForPost(title)}
                          alt={title}  
                          width={800}
                          height={320}
                          className="w-full h-[45vh] sm:h-[70vh]  object-cover"
                          priority={true}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 sm:via-black/10 via-black/30   to-transparent">
                          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                            <h2 className="text-lg sm:text-2xl font-bold leading-6 sm:leading-8 tracking-tight mb-2 sm:mb-3">
                              {title}
                            </h2>
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
                            <div className="flex justify-between items-center">
                              <span className="text-primary-400 hover:text-primary-300 font-medium text-sm sm:text-base">
                                Read more &rarr;
                              </span>
                              <time dateTime={date} className="text-xs sm:text-sm text-gray-200" suppressHydrationWarning>
                                {formatDate(date, siteMetadata.locale)}
                              </time>
                            </div>
                          </div>
                        </div>
                                            </Link>
                    </div>
                    </article>
                  </li>
                )
              })}
            </ul>
            {pagination && pagination.totalPages > 1 && (
              <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
