const errorToast = (message: string) => {
	useToast().add({
		title: "Error",
		description: message,
		color: "error",
		duration: 5000,
	})
}

export default errorToast
