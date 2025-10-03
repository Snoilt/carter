import { faker } from "@faker-js/faker"

import { z } from "zod"

const _schema = z
	.object({
		name: z.string(),
		email: z.email("Invalid email"),
		password: z.string().min(8, "Password should be at least 8 characters"),
		passwordConfirm: z.string(),
	})
	.refine((data) => data.password === data.passwordConfirm, {
		message: "Passwords don't match",
		path: ["passwordConfirm"],
	})

type Schema = z.output<typeof _schema>

const fillRegisterForm = (data: Partial<Schema>) => {
	data.name = faker.person.firstName() + " " + faker.person.lastName()
	data.email = faker.internet.email()
	data.password = faker.internet.password({ length: 8 })
	data.passwordConfirm = data.password
	console.log("Filled register form with:", data)
}

export default fillRegisterForm
