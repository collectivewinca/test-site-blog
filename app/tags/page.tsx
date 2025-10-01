import TagFilters from '@/components/TagFilters'
import tagData from 'app/tag-data.json'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Tags', description: 'Things I blog about' })

export default async function Page() {
  const tagCounts = tagData as Record<string, number>

  return (
    <div className="mx-auto max-w-6xl px-4">
      <div className="space-y-2 flex flex-col items-center justify-center pb-8 pt-6 md:space-y-5">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
          Tags
        </h1>
      </div>

      <TagFilters tags={tagCounts} />
    </div>
  )
}
