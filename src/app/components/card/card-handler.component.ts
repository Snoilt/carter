import { Component, EventEmitter, Input, Output } from '@angular/core'
import { ModalComponent } from '../../shared/components/modal.component'
import { CardEditorComponent } from './card-editor.component'
import type { CardsRecord, DecksRecord } from '../../types/pb'
import { PocketBaseService } from '../../core/services/pocketbase.service'
import { ToastService } from '../../core/services/toast.service'
import { NgIf } from '@angular/common'

@Component({
  selector: 'app-card-handler',
  standalone: true,
  imports: [ModalComponent, CardEditorComponent, NgIf],
  template: `
    <div *ngIf="showTrigger" class="inline-block" (click)="openModal()">
      <ng-content></ng-content>
    </div>

    <app-modal
      [title]="'Card Name'"
      [(open)]="open"
      (openChange)="openChange.emit($event)"
    >
      <div modal-body class="space-y-6">
        <div>
          <h1 class="text-lg font-bold">Front</h1>
          <app-card-editor [(modelValue)]="frontContent"></app-card-editor>
        </div>
        <div>
          <h1 class="text-lg font-bold">Back</h1>
          <app-card-editor [(modelValue)]="backContent"></app-card-editor>
        </div>
        <div class="flex gap-2">
          <button *ngIf="card" class="btn btn-outline" type="button" (click)="deleteCard()">
            Delete
          </button>
          <button class="btn btn-primary w-full" type="button" (click)="saveCard()">
            Save
          </button>
        </div>
      </div>
    </app-modal>
  `,
})
export class CardHandlerComponent {
  @Input() card?: CardsRecord
  @Input() deck!: DecksRecord
  @Input() open = false
  @Input() showTrigger = true
  @Output() openChange = new EventEmitter<boolean>()
  @Output() cardUpdate = new EventEmitter<void>()

  frontContent = ''
  backContent = ''

  constructor(private pbService: PocketBaseService, private toast: ToastService) {}

  ngOnInit() {
    if (this.card) {
      this.frontContent = this.card.question || ''
      this.backContent = this.card.solution || ''
    }
  }

  openModal() {
    this.open = true
    this.openChange.emit(true)
  }

  async saveCard() {
    if (this.card) {
      await this.pbService.pb.collection('cards').update(this.card.id, {
        question: this.frontContent,
        solution: this.backContent,
      })
    } else {
      await this.pbService.pb.collection('cards').create({
        question: this.frontContent,
        solution: this.backContent,
        deck: this.deck.id,
      })
    }

    this.cardUpdate.emit()
    this.open = false
    this.openChange.emit(false)
  }

  async deleteCard() {
    if (!this.card) return

    try {
      await this.pbService.pb.collection('cards').delete(this.card.id)
      this.toast.add({ title: 'Card deleted successfully', color: 'success' })
      this.cardUpdate.emit()
      this.open = false
      this.openChange.emit(false)
    } catch (error) {
      this.toast.add({ title: 'Error', description: String(error), color: 'error' })
    }
  }
}
