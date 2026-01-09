import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { PocketBaseService } from './pocketbase.service'
import { ToastService } from './toast.service'

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private pbService: PocketBaseService,
    private router: Router,
    private toast: ToastService,
  ) {}

  isLoggedIn() {
    return this.pbService.pb.authStore.isValid
  }

  async login(email: string, password: string) {
    try {
      await this.pbService.pb.collection('users').authWithPassword(email, password)
      this.toast.add({ title: 'Login successful', color: 'success' })
      await this.router.navigate(['/dashboard'])
    } catch {
      this.toast.add({
        title: 'Login failed',
        description: 'Please check your credentials and try again.',
        color: 'error',
      })
    }
  }

  async register(email: string, password: string, passwordConfirm: string) {
    try {
      await this.pbService.pb.collection('users').create({
        email,
        password,
        passwordConfirm,
      })
      await this.pbService.pb.collection('users').authWithPassword(email, password)
      this.toast.add({ title: 'Registration successful', color: 'success' })
      await this.router.navigate(['/dashboard'])
    } catch {
      this.toast.add({
        title: 'Registration failed',
        description: 'Please check your information and try again.',
        color: 'error',
      })
    }
  }

  logout() {
    this.pbService.pb.authStore.clear()
    this.router.navigate(['/auth/login'])
  }
}
