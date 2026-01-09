import { Routes } from '@angular/router'
import { AuthService } from './core/services/auth.service'
import { inject } from '@angular/core'
import { Router } from '@angular/router'
import { HomeComponent } from './pages/home/home.component'
import { LoginComponent } from './pages/auth/login/login.component'
import { RegisterComponent } from './pages/auth/register/register.component'
import { DashboardComponent } from './pages/dashboard/dashboard.component'
import { RoomComponent } from './pages/room/room/room.component'
import { RoomDeckComponent } from './pages/room/room-deck/room-deck.component'
import { RoomPlayComponent } from './pages/room/room-play/room-play.component'
import { DebugComponent } from './pages/debug/debug.component'

const publicGuard = () => {
  const auth = inject(AuthService)
  const router = inject(Router)
  if (auth.isLoggedIn()) {
    return router.parseUrl('/dashboard')
  }
  return true
}

const authGuard = () => {
  const auth = inject(AuthService)
  const router = inject(Router)
  if (!auth.isLoggedIn()) {
    return router.parseUrl('/auth/login')
  }
  return true
}

export const routes: Routes = [
  { path: '', component: HomeComponent, canMatch: [publicGuard] },
  { path: 'auth/login', component: LoginComponent, canMatch: [publicGuard] },
  { path: 'auth/register', component: RegisterComponent, canMatch: [publicGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'room/:room', component: RoomComponent, canActivate: [authGuard] },
  { path: 'room/:room/deck/:deck', component: RoomDeckComponent, canActivate: [authGuard] },
  { path: 'room/:room/play/:deck', component: RoomPlayComponent, canActivate: [authGuard] },
  { path: 'debug', component: DebugComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
]
