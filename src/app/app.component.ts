import { Component, computed, signal } from '@angular/core'
import { RouterLink, RouterOutlet } from '@angular/router'
import { NgFor, NgIf } from '@angular/common'
import { AuthService } from './core/services/auth.service'
import { ToastContainerComponent } from './shared/components/toast-container.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgIf, NgFor, ToastContainerComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  isMenuOpen = signal(false)

  constructor(public auth: AuthService) {}

  navItems = computed(() => {
    const isLoggedIn = this.auth.isLoggedIn()
    return [
      { label: 'Login', path: '/auth/login', show: !isLoggedIn },
      { label: 'Register', path: '/auth/register', show: !isLoggedIn },
    ].filter((item) => item.show)
  })

  toggleMenu() {
    this.isMenuOpen.update((open) => !open)
  }

  logout() {
    this.auth.logout()
  }
}
