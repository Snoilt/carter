export default defineNuxtRouteMiddleware((to) => {
	const isLoggedIn = pb.authStore.isValid

	const publicExact = new Set(["/", "/impressum", "/datenschutz"])

	// Auth-only pages (redirect logged-in users away from these)
	const authPrefixes = ["/auth/login", "/auth/register"]
	// Other public pages that should remain accessible even when logged-in
	const publicPrefixes = ["/invite/"]

	const isAuthPage = authPrefixes.some((p) => to.path.startsWith(p))
	const isPublic =
		publicExact.has(to.path) ||
		isAuthPage ||
		publicPrefixes.some((p) => to.path.startsWith(p))

	// Only redirect logged-in users away from auth pages or home, not from /invite
	if (isLoggedIn && (isAuthPage || to.path === "/")) {
		return navigateTo("/dashboard")
	}

	if (!isLoggedIn && !isPublic) {
		return navigateTo("/auth/login")
	}
})
