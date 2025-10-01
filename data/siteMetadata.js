/** @type {import("pliny/config").PlinyConfig } */
import siteData from '../siteData.js'
const basePath = process.env.BASE_PATH || ''

const siteMetadata = {
  title: siteData.title,
  author: siteData.author,
  headerTitle: siteData.headerTitle,
  descriptionTitle: siteData.descriptionTitle,
  description: siteData.description,
  language: siteData.language,
  theme: siteData.theme, // system, dark or light
  siteUrl: siteData.siteUrl,
  mainSiteUrl: siteData.mainSiteUrl, // URL for the main company website
  siteRepo: siteData.siteRepo,
  siteLogo: `${basePath}${siteData.siteLogo}`,
  socialBanner: `${basePath}${siteData.socialBanner}`,
  mastodon: siteData.mastodon,
  email: siteData.email,
  logo_light: `${basePath}${siteData.logo_light}`,
  logo_dark: `${basePath}${siteData.logo_dark}`,
  favicon: `${basePath}${siteData.favicon}`,
  // github: 'https://github.com',
  // x: 'https://twitter.com/test/',
  // twitter: 'https://twitter.com/Twitter',
  // facebook: 'https://facebook.com',
  // youtube: 'https://youtube.com',
  // linkedin: 'https://www.linkedin.com',
  // threads: 'https://www.threads.net',
  // instagram: 'https://www.instagram.com/test',
  // medium: 'https://medium.com',
  // bluesky: 'https://bsky.app/',
  locale: siteData.locale,
  // set to true if you want a navbar fixed to the top
  stickyNav: !!siteData.stickyNav,
  analytics: {
    ...siteData.analytics,
    umamiAnalytics: {
      ...(siteData.analytics && siteData.analytics.umamiAnalytics
        ? siteData.analytics.umamiAnalytics
        : {}),
      umamiWebsiteId:
        process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ||
        '9c033916-e659-4018-b4f5-f1728b34a477',
    },
  },
  newsletter: siteData.newsletter,
  comments: /** @type {import('pliny/config').GiscusConfig} */ ({
    // If you want to use an analytics provider you have to add it to the
    // content security policy in the `next.config.js` file.
    // Select a provider and use the environment variables associated to it
    // https://vercel.com/docs/environment-variables
    provider: 'giscus', // supported providers: giscus, utterances, disqus
    giscusConfig: {
      // Visit the link below, and follow the steps in the 'configuration' section
      // https://giscus.app/
      repo: siteData.comments?.giscusConfig?.repo,
      repositoryId: siteData.comments?.giscusConfig?.repositoryId,
      category: siteData.comments?.giscusConfig?.category,
      categoryId: siteData.comments?.giscusConfig?.categoryId,
      mapping: siteData.comments?.giscusConfig?.mapping || 'pathname', // supported options: pathname, url, title
      reactions: siteData.comments?.giscusConfig?.reactions || '1', // Emoji reactions: 1 = enable / 0 = disable
      // Send discussion metadata periodically to the parent window: 1 = enable / 0 = disable
      metadata: siteData.comments?.giscusConfig?.metadata || '0',
      // theme example: light, dark, dark_dimmed, dark_high_contrast
      // transparent_dark, preferred_color_scheme, custom
      theme: siteData.comments?.giscusConfig?.theme || 'light',
      // theme when dark mode
      darkTheme: siteData.comments?.giscusConfig?.darkTheme || 'transparent_dark',
      // If the theme option above is set to 'custom`
      // please provide a link below to your custom theme css file.
      // example: https://giscus.app/themes/custom_example.css
      themeURL: siteData.comments?.giscusConfig?.themeURL || '',
      // This corresponds to the `data-lang="en"` in giscus's configurations
      lang: siteData.comments?.giscusConfig?.lang || 'en',
    },
  }),
  search: {
    provider: siteData.search?.provider || 'kbar', // kbar or algolia
    kbarConfig: {
      searchDocumentsPath: `${basePath}/search.json`, // path to load documents to search
    },
    // provider: 'algolia',
    // algoliaConfig: {
    //   // The application ID provided by Algolia
    //   appId: 'R2IYF7ETH7',
    //   // Public API key: it is safe to commit it
    //   apiKey: '599cec31baffa4868cae4e79f180729b',
    //   indexName: 'docsearch',
    // },
  },
}

export default siteMetadata
