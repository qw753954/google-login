// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'node:url'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      googleClientId: '9816565000-d1rrgqgnfeagn8rotpsnlj9314l3pkm5.apps.googleusercontent.com'
    }
  },
  vite: {
    vue: {
      script: {
        globalTypeFiles: [fileURLToPath(new URL('types/index.d.ts', import.meta.url))],
      },
      template: {
        transformAssetUrls,
      },
    },
  },
  app: {
    head: {
      // link: [
      //   { rel: 'stylesheet', href: 'bootstrap/dist/css/bootstrap.min.css' },
      // ],

      script: [{ src: "https://accounts.google.com/gsi/client", async: true, defer: true }],
    },
  },
})
