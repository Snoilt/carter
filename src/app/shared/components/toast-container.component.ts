import { Component } from '@angular/core'
import { AsyncPipe, NgFor } from '@angular/common'
import { ToastService } from '../../core/services/toast.service'

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [AsyncPipe, NgFor],
  template: `
    <div class="fixed right-4 top-4 z-50 flex w-72 flex-col gap-2">
      <div
        *ngFor="let toast of toastService.toasts$ | async"
        class="rounded-lg border border-slate-200 bg-white p-3 shadow-lg"
      >
        <p class="text-sm font-semibold" [class.text-emerald-600]="toast.color === 'success'"
          [class.text-rose-600]="toast.color === 'error'">
          {{ toast.title }}
        </p>
        <p class="text-xs text-slate-600" *ngIf="toast.description">{{ toast.description }}</p>
      </div>
    </div>
  `,
})
export class ToastContainerComponent {
  constructor(public toastService: ToastService) {}
}
