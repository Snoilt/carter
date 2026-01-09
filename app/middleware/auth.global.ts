export default defineNuxtRouteMiddleware((to) => {
	//TODO: Check if this is the best way to handle auth in Nuxt 4

	const isLoggedIn = pb.authStore.isValid

	// Public routes that don't require authentication
	const publicRoutes = new Set(["/auth/login", "/auth/register", "/", "/impressum", "/datenschutz"])

	// Redirect to dashboard if logged-in user tries to access login/register
	if (isLoggedIn && publicRoutes.has(to.path)) {
		return navigateTo("/dashboard")
	}

	// Redirect to login if non-logged-in user tries to access protected routes
	if (!isLoggedIn && !publicRoutes.has(to.path)) {
		return navigateTo("/auth/login")
	}
})
