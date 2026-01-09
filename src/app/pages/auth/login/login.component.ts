import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { z } from 'zod'
import { AuthService } from '../../../core/services/auth.service'
import { MaxContainerComponent } from '../../../shared/components/max-container.component'
import { ToastService } from '../../../core/services/toast.service'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password should be at least 8 characters'),
})

type Schema = z.output<typeof schema>

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, MaxContainerComponent],
  template: `
    <app-max-container>
      <div class="m-auto w-full max-w-md">
        <div class="card p-6">
          <form class="space-y-4" (ngSubmit)="login()">
            <h1 class="text-2xl font-bold">Log in with your Email</h1>
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
            <button class="btn btn-primary w-full" type="submit">Log in</button>

            <div class="border-t border-slate-200 pt-4">
              <p class="text-sm text-slate-500">Or log in with an existing Account</p>
              <div class="mt-3 grid gap-2">
                <button class="btn btn-outline" type="button">Log in with Apple</button>
                <button class="btn btn-outline" type="button">Log in with Google</button>
                <button class="btn btn-outline" type="button">Log in with Github</button>
              </div>
            </div>

            <p class="text-sm text-slate-600">
              Dont have an Account?
              <a class="text-indigo-500" routerLink="/auth/register">Register Now</a>
            </p>
          </form>
        </div>
      </div>
    </app-max-container>
  `,
})
export class LoginComponent {
  state: Partial<Schema> = {
    email: '',
    password: '',
  }

  constructor(private auth: AuthService, private toast: ToastService) {}

  async login() {
    const result = schema.safeParse(this.state)
    if (!result.success) {
      this.toast.add({
        title: 'Login failed',
        description: result.error.issues[0]?.message,
        color: 'error',
      })
      return
    }

    await this.auth.login(result.data.email, result.data.password)
  }
}
