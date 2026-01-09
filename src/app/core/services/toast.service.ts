import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

export type ToastColor = 'success' | 'error' | 'info'

export type Toast = {
  id: string
  title: string
  description?: string
  color?: ToastColor
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly toastsSubject = new BehaviorSubject<Toast[]>([])
  readonly toasts$ = this.toastsSubject.asObservable()

  add(toast: Omit<Toast, 'id'>) {
    const id = crypto.randomUUID()
    const nextToast: Toast = { id, ...toast }
    this.toastsSubject.next([...this.toastsSubject.value, nextToast])
    setTimeout(() => this.remove(id), 4000)
  }

  remove(id: string) {
    this.toastsSubject.next(this.toastsSubject.value.filter((toast) => toast.id !== id))
  }
}
