import { Component, HostListener } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { z } from 'zod'
import { AuthService } from '../../../core/services/auth.service'
import { MaxContainerComponent } from '../../../shared/components/max-container.component'
import { ToastService } from '../../../core/services/toast.service'
import { fillRegisterForm } from '../../../shared/utils/fill-register'

const schema = z
  .object({
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Password should be at least 8 characters'),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ['passwordConfirm'],
  })

type Schema = z.output<typeof schema>

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, MaxContainerComponent],
  template: `
    <app-max-container>
      <div class="m-auto w-full max-w-md">
        <div class="card p-6">
          <form class="space-y-4" (ngSubmit)="register()">
            <h1 class="text-2xl font-bold">Create your Account</h1>
            <input
              class="input"
              type="email"
              name="email"
              placeholder="E-Mail"
              [(ngModel)]="state.email"
              required
            />
            <input
              class="input"
              type="password"
              name="password"
              placeholder="Password"
              [(ngModel)]="state.password"
              required
            />
            <input
              class="input"
              type="password"
              name="passwordConfirm"
              placeholder="Confirm Password"
              [(ngModel)]="state.passwordConfirm"
              required
            />
            <button class="btn btn-primary w-full" type="submit">Register</button>

            <div class="border-t border-slate-200 pt-4">
              <p class="text-sm text-slate-500">Or register with an Account</p>
              <div class="mt-3 grid gap-2">
                <button class="btn btn-outline" type="button">Register with Apple</button>
                <button class="btn btn-outline" type="button">Register with Google</button>
                <button class="btn btn-outline" type="button">Register with Github</button>
              </div>
            </div>

            <p class="text-sm text-slate-600">
              Already have an Account?
              <a class="text-indigo-500" routerLink="/auth/login">Log in</a>
            </p>
          </form>
        </div>
      </div>
    </app-max-container>
  `,
})
export class RegisterComponent {
  state: Partial<Schema> = {
    email: '',
    password: '',
    passwordConfirm: '',
  }

  constructor(private auth: AuthService, private toast: ToastService) {}

  @HostListener('document:keydown', ['$event'])
  handleShortcut(event: KeyboardEvent) {
    if (event.metaKey && event.key.toLowerCase() === 'o') {
      event.preventDefault()
      fillRegisterForm(this.state)
    }
  }

  async register() {
    const result = schema.safeParse(this.state)
    if (!result.success) {
      this.toast.add({
        title: 'Registration failed',
        description: result.error.issues[0]?.message,
        color: 'error',
      })
      return
    }

    await this.auth.register(
      result.data.email,
      result.data.password,
      result.data.passwordConfirm,
    )
  }
}
