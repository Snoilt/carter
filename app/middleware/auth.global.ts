export default defineNuxtRouteMiddleware((to) => {
	const isLoggedIn = pb.authStore.isValid

	const publicExact = new Set(["/", "/impressum", "/datenschutz"])

	const publicPrefixes = ["/auth/login", "/auth/register"]

	const isPublic =
		publicExact.has(to.path) || publicPrefixes.some((p) => to.path.startsWith(p))

	if (isLoggedIn && isPublic) {
		return navigateTo("/dashboard")
	}

	if (!isLoggedIn && !isPublic) {
		return navigateTo("/auth/login")
	}
})
