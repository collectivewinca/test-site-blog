import { BANNER_IMAGES } from '../../publicBannerImages'

// Available banner images imported from publicBannerImages.js

// Function that uses the post title as a seed for consistent results per post
// This ensures the same post always gets the same banner (useful for caching)
export function getBannerForPost(title: string): string {
  // Validate input
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    // Return first banner as fallback for invalid titles
    return BANNER_IMAGES[0]
  }

  // Create a simple hash from the title to get consistent results
  let hash = 0
  const cleanTitle = title.trim()
  
  for (let i = 0; i < cleanTitle.length; i++) {
    const char = cleanTitle.charCodeAt(i)
    // Use a more robust hash calculation to avoid overflow
    hash = ((hash << 5) - hash + char) >>> 0 // Convert to unsigned 32-bit
  }
  
  const index = hash % BANNER_IMAGES.length
  return BANNER_IMAGES[index]
}

// Function to get a banner for a post when no specific banner is provided
// Uses title hash for consistent results per post
export function getBannerForPostOrDefault(title: string, providedBanner?: string): string {
  // If a banner is provided and it's valid, use it
  if (providedBanner && typeof providedBanner === 'string' && providedBanner.trim().length > 0) {
    return providedBanner
  }
  
  // Otherwise, use title-based banner selection
  return getBannerForPost(title)
} 