// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
				compatibilityDate: "2025-07-15",
				devtools: { enabled: true },
				modules: [
				 "@nuxt/eslint",
				 "@nuxt/ui",
				 "@nuxt/icon",
				 "@nuxtjs/mdc",
				],
				css: ["~/assets/css/main.css"],
				ssr: false,
})