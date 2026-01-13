// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	devtools: { enabled: true },
	modules: ["@nuxt/eslint", "@nuxt/ui", "@nuxt/icon", "@nuxtjs/mdc", "@nuxt/fonts"],
	css: ["~/assets/css/main.css"],
	ssr: false,
	colorMode: {
		preference: "system",
		fallback: "light",
		classSuffix: "",
	},
	fonts: {
		families: [{ name: "JetBrains Mono", provider: "google", weights: ["400", "700"] }],
	},
})
