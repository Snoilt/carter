import { Component, EventEmitter, Input, Output } from '@angular/core'
import { NgIf } from '@angular/common'

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [NgIf],
  template: `
    <div *ngIf="open" class="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
      <div class="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-semibold">{{ title }}</h2>
          <button class="text-slate-500" type="button" (click)="close()">✕</button>
        </div>
        <div class="space-y-4">
          <ng-content select="[modal-body]"></ng-content>
        </div>
        <div class="mt-6">
          <ng-content select="[modal-footer]"></ng-content>
        </div>
      </div>
    </div>
  `,
})
export class ModalComponent {
  @Input() title = ''
  @Input() open = false
  @Output() openChange = new EventEmitter<boolean>()

  close() {
    this.open = false
    this.openChange.emit(false)
  }
}
