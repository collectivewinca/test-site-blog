import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import NewsletterForm from '@/components/NewsletterForm'
import Image from '@/components/Image'
import { getBannerForPost } from './lib/bannerUtils'

const MAX_DISPLAY = 5

export default function Home({ posts }) {
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-2 pt-2 max-w-2xl md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            {siteMetadata.descriptionTitle}
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            {siteMetadata.description}
          </p>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {!posts.length && 'No posts found.'}
          {posts.slice(0, MAX_DISPLAY).map((post) => {
            const { slug, date, title, summary, tags, images } = post
            return (
              <li key={slug} className="py-2">
                <article>
                  <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <Link href={`/blog/${slug}`} aria-label={`Link to ${title}`}>
                      <Image
                        src={images && images.length > 0 ? images[0] : getBannerForPost(title)}
                        alt={title}
                        width={800}
                        height={320}
                        className="w-full h-[45vh] sm:h-[70vh] object-cover"
                        priority={true}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 sm:via-black/10 via-black/30   to-transparent">
                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                          <h2 className="text-lg sm:text-2xl font-bold leading-6 sm:leading-8 tracking-tight mb-2 sm:mb-3">
                            {title}
                          </h2>
                          <div className="flex flex-wrap mb-2 sm:mb-3">
                            {tags.slice(0, 5).map((tag) => (
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
                            <time dateTime={date} className="text-xs sm:text-sm text-gray-200">
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
      </div>
      {posts.length > MAX_DISPLAY && (
        <div className="flex justify-end text-base font-medium leading-6">
          <Link
            href="/blog"
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            aria-label="All posts"
          >
            All Posts &rarr;
          </Link>
        </div>
      )}
      {siteMetadata.newsletter?.provider && (
        <div className="flex items-center justify-center pt-4">
          <NewsletterForm />
        </div>
      )}
    </>
  )
}
