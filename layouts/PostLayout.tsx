'use client'
import { ReactNode, useEffect, useState } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog, Authors } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import Image from '@/components/Image'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import MixtapeCard from '@/components/MixtapeCard'
import ShareModal from '@/components/ShareModal'
import { useTheme } from 'next-themes'
import { getBannerForPost } from '../app/lib/bannerUtils'
import NewsletterForm from '@/components/NewsletterForm'
import { getAuthorProfile } from '../app/lib/authorImageUtils'
import { Share2Icon } from 'lucide-react'

const editUrl = (path) => `${siteMetadata.siteRepo}/blob/main/data/${path}`
const discussUrl = (path) =>
  `https://mobile.twitter.com/search?q=${encodeURIComponent(`${siteMetadata.siteUrl}/${path}`)}`

const postDateTemplate: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

interface LayoutProps {
  content: CoreContent<Blog> & {
    mixtape?: {
      name: string
      imageUrl: string
      shortenedLink: string
    }
  }
  authorDetails: CoreContent<Authors>[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  children: ReactNode
}

export default function PostLayout({ content, authorDetails, next, prev, children }: LayoutProps) {
  const { filePath, path, slug, date, title, tags, mixtape, images, summary } = content as any
  const basePath = path.split('/')[0]

  const { theme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [currentLogo, setCurrentLogo] = useState(siteMetadata.logo_dark)
  
    useEffect(() => {
      setMounted(true)
    }, [])
  
    useEffect(() => {
      if (mounted) {
        setCurrentLogo(resolvedTheme === 'light' ? siteMetadata.logo_light : siteMetadata.logo_dark)
      }
    }, [resolvedTheme, mounted])

  const authorProfile = getAuthorProfile(title, authorDetails?.[0]?.name)

  const [isShareOpen, setIsShareOpen] = useState(false)
  const shareUrl = `${siteMetadata.siteUrl}/${path}`
  const shareImage = images && images.length > 0 ? images[0] : getBannerForPost(title)

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article>
        <div className="sm:px-0">
          <header className="pt-6 xl:pb-6 -mx-4 sm:mx-0">
            <div className="relative">
              <div className="relative aspect-[2/1] sm:aspect-[3/1] w-full">
                <Image 
                  src={images && images.length > 0 ? images[0] : getBannerForPost(title)} 
                  alt={`Blog banner for ${title}`} 
                  fill 
                  className="object-cover rounded-none sm:rounded-lg"
                  priority={true}
                  loading="eager"
                />
                {/* Overlay gradient for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/20 to-transparent rounded-none sm:rounded-lg"></div>
                {/* Share button */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                  <button
                    onClick={() => setIsShareOpen(true)}
                    className="rounded-full bg-neutral-900/30 p-3 text-sm font-semibold text-white hover:bg-neutral-900/50 transition-colors duration-200 shadow-xl"
                  >
                    <Share2Icon className="w-4 h-4" />
                  </button>
                </div>
                {/* Title overlay on the image */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 text-center">
                  <div className="space-y-2 sm:space-y-3 px-2 sm:px-0">
                    <dl className="space-y-2">
                      <div>
                        <dt className="sr-only">Published on</dt>
                        <dd className="text-sm sm:text-base font-medium leading-6 text-white/90 drop-shadow-lg break-words">
                          <time dateTime={date}>
                            {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
                          </time>
                        </dd>
                      </div>
                    </dl>
                    <div>
                      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white drop-shadow-lg leading-tight break-words px-2 sm:px-0">
                        {title}
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <div className="grid-rows-[auto_1fr] divide-y divide-gray-200 pb-8 dark:divide-gray-700 xl:grid xl:grid-cols-4 xl:gap-x-6 xl:divide-y-0">
            <dl className="pb-4 pt-2 border-b border-gray-200 dark:border-gray-700 md:pt-4">
              <dd className="flex flex-col items-center text-center lg:items-stretch lg:text-left">
                <div className="text-xs uppercase tracking-wide font-medium leading-6 text-gray-500 dark:text-gray-400">AUTHOR</div>
                <div className="flex w-full items-center justify-center md:justify-center lg:justify-between gap-4">
                  <div className="flex items-center gap-2 py-1 justify-center md:justify-center lg:justify-start lg:pl-2 mx-auto lg:mx-0">
                    <div className="flex items-center gap-3">
                      <Image
                        src={authorProfile.imagePath ?? currentLogo}
                        width={44}
                        height={44}
                        alt={`${authorProfile.displayName} avatar`}
                        className="rounded-full object-cover"
                        priority={true}
                      />
                      <div className="flex flex-col items-center lg:items-start">
                        <div className="text-base font-medium leading-6 text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                          {authorProfile.displayName}
                        </div>
                        {authorProfile.designation && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">{authorProfile.designation}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </dd>
            </dl>
            <div className="divide-y divide-gray-200 dark:divide-gray-700 xl:col-span-3 xl:row-span-2 xl:pb-0">
              <div className="prose max-w-none pb-8 pt-10 dark:prose-invert">
                {children}
                <p className="mt-6 text-sm text-gray-500 dark:text-gray-400 italic">
                  For this blog, {siteMetadata.title} used generative AI to help with an initial draft. An editor verified the accuracy of the information before publishing.
                </p>
              </div>
              {/* Right-aligned share action at end of content */}
              <div className="pt-2 pb-6">
                <div className="flex justify-center lg:justify-end">
                  <button
                    onClick={() => setIsShareOpen(true)}
                    className="group inline-flex items-center gap-2 text-primary-500 dark:text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 text-lg sm:text-xl"
                  >
                    <Share2Icon className="w-5 h-5" />
                    <span>Share the blog</span>
                  </button>
                </div>
              </div>
              {mixtape && (
                  <div className="py-4">
                    <h2 className="mb-4 text-2xl font-bold">Featured Mixtape</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <MixtapeCard mixtape={mixtape} />
                    </div>
                  </div>
                )}
              
              {/* {siteMetadata.comments && (
                <div
                  className="pb-6 pt-6 text-center text-gray-700 dark:text-gray-300"
                  id="comment"
                >
                  <Comments slug={slug} />
                </div>
              )} */}
            </div>
            <footer>
              <div className="divide-gray-200 text-sm font-medium leading-5 dark:divide-gray-700 xl:col-start-1 xl:row-start-2 xl:divide-y">
                {tags && (
                  <div className="py-4 xl:py-8 text-center xl:text-left">
                    <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Tags
                    </h2>
                    <div className="mt-1 flex flex-wrap items-center justify-center xl:justify-start gap-2">
                      {tags.map((tag) => (
                        <Tag key={tag} text={tag} />
                      ))}
                    </div>
                  </div>
                )}
                {(next || prev) && (
                  <div className="flex justify-center gap-8 py-4 xl:justify-between xl:py-8">
                    {prev && prev.path && (
                      <div className="text-center xl:text-left">
                        <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          Previous Article
                        </h2>
                        <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                          <Link href={`/${prev.path}`}>{prev.title}</Link>
                        </div>
                      </div>
                    )}
                    {next && next.path && (
                      <div className="text-center xl:text-left">
                        <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          Next Article
                        </h2>
                        <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                          <Link href={`/${next.path}`}>{next.title}</Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <hr className="my-4 border-gray-200 dark:border-gray-700" />
              <div className="flex justify-center xl:justify-start">
                <Link
                  href={siteMetadata.mainSiteUrl}
                  className="mt-2 text-sm font-semibold text-primary-500 dark:text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  <div className="flex flex-row items-center gap-2">
                    <Image src={currentLogo} alt="logo" width={64} height={64} className="rounded-full" />
                    <div className="text-sm font-semibold">Visit Our Site</div>
                  </div>
                </Link>
              </div>
              <hr className="my-4 border-gray-200 dark:border-gray-700" />
              <div className="pt-4 xl:pt-8 flex justify-center xl:justify-start">
                <Link
                  href={`/${basePath}`}
                  className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                  aria-label="Back to the blog"
                >
                  &larr; Back to the blog
                </Link>
              </div>
            </footer>
          </div>
          {siteMetadata.newsletter?.provider && (
            <div className="flex items-center justify-center pt-8">
              <NewsletterForm />
            </div>
          )}
        </div>
        <ShareModal
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          title={title}
          url={shareUrl}
          summary={summary}
          image={shareImage}
        />
      </article>
    </SectionContainer>
  )
}
