import { faker } from '@faker-js/faker'

export type RegisterForm = {
  email?: string
  password?: string
  passwordConfirm?: string
}

export const fillRegisterForm = (data: RegisterForm) => {
  data.email = faker.internet.email()
  data.password = faker.internet.password({ length: 8 })
  data.passwordConfirm = data.password
}
