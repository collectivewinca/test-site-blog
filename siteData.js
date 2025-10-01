module.exports = {
  title: 'Main site name',
  author: 'Main site author',
  headerTitle: 'Main site header title',
  descriptionTitle: 'Main site description title',
  description: 'Main site description',
  language: 'en-us',
  theme: 'system',
  siteUrl: 'https://www.test.com',
  mainSiteUrl: 'https://www.test.com',
  siteRepo: 'https://github.com/',
  siteLogo: '/static/images/logo.png',
  socialBanner: '/static/images/logo-dark.png',
  mastodon: 'https://mastodon.social/@test',
  email: 'hello@test.com',
  logo_light: '/static/images/logo-light.png',
  logo_dark: '/static/images/logo-dark.png',
  favicon: '/static/images/favicon.ico',
  locale: 'en-US',
  stickyNav: false,
  analytics: {
    umamiAnalytics: {
      umamiWebsiteId: '9c033916-e659-4018-b4f5-f1728b34a477',
      src: 'https://analysis.weekend.network/script.js',
    },
    // plausibleAnalytics: { },
    // simpleAnalytics: { },
    // posthogAnalytics: { posthogProjectApiKey: '' },
  },
  newsletter: {
    provider: 'resend',
  },
  comments: {
    provider: 'giscus',
    giscusConfig: {
      repo: '',
      repositoryId: '',
      category: '',
      categoryId: '',
      mapping: 'pathname',
      reactions: '1',
      metadata: '0',
      theme: 'light',
      darkTheme: 'transparent_dark',
      themeURL: '',
      lang: 'en',
    },
  },
  search: {
    provider: 'kbar',
    // kbarConfig.searchDocumentsPath is set in siteMetadata.js with BASE_PATH
  },
};

