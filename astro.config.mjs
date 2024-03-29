import { defineConfig } from 'astro/config';
import storyblok from '@storyblok/astro';
import { loadEnv } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";
import sitemap from "@astrojs/sitemap";
const env = loadEnv("", process.cwd(), 'STORYBLOK');


// https://astro.build/config
export default defineConfig({
  image: {
    remotePatterns: [{ protocol: "https" }],
    service: {
      entrypoint: 'astro/assets/services/noop'
    },
  },
  redirects: {
    '/': '/home',
    '/en/': '/en/home'
  },
  site: "https://www.mainecoon-kitten.de",
  integrations: [storyblok({
    accessToken: env.STORYBLOK_TOKEN,
    bridge: env.STORYBLOK_IS_PREVIEW === "yes",
    components: {
      page: 'storyblok/Page',
      grid: 'storyblok/Grid',
      config: 'storyblok/Config',
      profile: 'storyblok/Profile',
      'all-profiles': 'storyblok/AllProfiles',
      'contact-page': 'storyblok/Contact',
      'gallery-page': 'storyblok/GalleryPage',
      'home-page': 'storyblok/HomePage',
      'values-list': 'storyblok/ValuesList',
      entry: 'storyblok/Entry',
      'menu-link': 'storyblok/MenuLink',
      'all-information-posts': 'storyblok/AllInformationPosts',
      'information-post': 'storyblok/InformationPost',
      relative: 'storyblok/Relative'
    },
    apiOptions: {
      region: 'eu'
    }
  }), react(), tailwind({
    applyBaseStyles: false
  }), sitemap()],
  ...(env.STORYBLOK_IS_PREVIEW === "yes" && {
    output: "server",
    adapter: vercel()
  }),
  ...(env.STORYBLOK_ENV === 'development' && {
    vite: {
      plugins: [basicSsl()],
      server: {
        https: true
      }
    }
  })
});