'use client'

import { useState } from 'react'
import Tag from '@/components/Tag'
import Link from '@/components/Link'
import { slug } from 'github-slugger'

type TagFiltersProps = {
  tags: { [key: string]: number }
}

export default function TagFilters({ tags }: TagFiltersProps) {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)
  const [sortMode, setSortMode] = useState<'az' | 'popular'>('popular')
  
  const alphabet = '#ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
  const tagKeys = Object.keys(tags)

  const filterTagsByLetter = (letter: string) => {
    if (letter === '#') {
      return tagKeys.filter(tag => /^[^a-zA-Z]/.test(tag))
    }
    return tagKeys.filter(tag => tag.toUpperCase().startsWith(letter))
  }

     const sortTags = (tagList: string[]) => {
     if (sortMode === 'az') {
       return tagList.sort((a, b) => a.localeCompare(b))
     }
     return tagList.sort((a, b) => tags[b] - tags[a])
   }

  const filteredTags = selectedLetter
    ? filterTagsByLetter(selectedLetter)
    : tagKeys

  const sortedTags = sortTags(filteredTags)

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Filter Buttons */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {alphabet.map((letter) => (
            <button
              key={letter}
              className={`px-3 py-1 text-sm font-medium rounded-md 
                       transition-colors duration-200
                       ${
                         selectedLetter === letter
                           ? 'bg-primary-500 text-white dark:bg-primary-500'
                           : 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700'
                       }`}
              onClick={() => setSelectedLetter(letter === selectedLetter ? null : letter)}
            >
              {letter}
            </button>
          ))}
        </div>
                 <div className="flex justify-center gap-4 text-lg font-medium text-gray-600 dark:text-gray-300">
          <button
            className={`transition-colors duration-200 ${
              sortMode === 'az' ? 'text-primary-500' : 'hover:text-primary-500'
            }`}
            onClick={() => setSortMode('az')}
          >
            A - Z
          </button>
          <button
            className={`transition-colors duration-200 ${
              sortMode === 'popular' ? 'text-primary-500' : 'hover:text-primary-500'
            }`}
            onClick={() => setSortMode('popular')}
          >
            Popular
          </button>
        </div>
      </div>

      {/* Tags Display */}
      <div className="flex flex-wrap gap-4">
        {sortedTags.length === 0 && 'No tags found.'}
        {sortedTags.map((t) => (
          <div key={t} className="group">
            <Tag text={t} />
            <Link
              href={`/tags/${slug(t)}`}
              className="-ml-2 text-sm font-semibold uppercase text-gray-600 dark:text-gray-300 
                         group-hover:text-primary-500 dark:group-hover:text-primary-400
                         transition-colors duration-200"
              aria-label={`View posts tagged ${t}`}
            >
              {` (${tags[t]})`}
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
