// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
 typescript: {
		shim: false,
	},
  nitro: {
    experimental: {
      database: true
    },
    database: {
      mdbkn: {
        connector: 'sqlite',
        options: { name: 'db' }
      },
    }
  },
//  compatibilityDate: process.env.COMPATIBILITY_DATE,
 ssr: false,
 modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],
 tailwindcss: {
    // Options
  }
});