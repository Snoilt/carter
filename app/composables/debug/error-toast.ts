import type { NuxtError } from "#app"
import { FetchError } from "ofetch"

export const toastError = (error: unknown) => {
	const toast = useToast()

	if (error instanceof FetchError) {
		const { data } = error as FetchError<NuxtError>
		if (data?.message) {
			toast.add({
				title: "Error",
				description: data.message,
				color: "error",
				icon: "material-symbols:error-outline-rounded",
			})
		}
	}
}
