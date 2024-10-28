// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  router: {
    options: {
      // Apply `auth` middleware globally
      // middleware: ['auth']
    }
  },
  typescript: {
    shim: false
  },
  nitro: {
    experimental: {
      database: true
    },
    externals: {
      // Add bcrypt as an external dependency
      // inline: ['bcrypt']
    },
    database: {
      mdbkn: {
        connector: 'sqlite',
        options: { name: 'db' }
      }
    }
  },
  //  compatibilityDate: process.env.COMPATIBILITY_DATE,
  ssr: false,
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  tailwindcss: {
    // Options
  }
});
