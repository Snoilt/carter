import { Component, EventEmitter, Input, Output } from '@angular/core'
import { FormsModule } from '@angular/forms'
import type { DecksRecord } from '../../types/pb'
import { ModalComponent } from '../../shared/components/modal.component'
import { NgIf } from '@angular/common'
import { PocketBaseService } from '../../core/services/pocketbase.service'
import { ToastService } from '../../core/services/toast.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-deck-creator',
  standalone: true,
  imports: [FormsModule, ModalComponent, NgIf],
  template: `
    <div *ngIf="showTrigger" class="inline-block" (click)="openModal()">
      <ng-content></ng-content>
    </div>

    <app-modal
      [title]="deck ? 'Edit Deck' : 'Create new Deck'"
      [(open)]="open"
      (openChange)="openChange.emit($event)"
    >
      <div modal-body class="space-y-4">
        <div class="space-y-2">
          <h1 class="text-sm font-semibold">Deck Name</h1>
          <input class="input" type="text" placeholder="Subject" [(ngModel)]="deckName" />
        </div>
        <div class="space-y-2">
          <h1 class="text-sm font-semibold">Deck Description</h1>
          <input
            class="input"
            type="text"
            placeholder="Description"
            [(ngModel)]="deckDescription"
          />
        </div>
      </div>

      <div modal-footer>
        <div class="flex gap-2">
          <button
            *ngIf="deck"
            class="btn btn-outline"
            type="button"
            (click)="deleteDeck()"
          >
            Delete
          </button>
          <button class="btn btn-primary w-full" type="button" (click)="createDeck()">
            {{ deck ? 'Save Changes' : 'Create Deck' }}
          </button>
        </div>
      </div>
    </app-modal>
  `,
})
export class DeckCreatorComponent {
  @Input() deck?: DecksRecord
  @Input() roomId?: string
  @Input() open = false
  @Input() showTrigger = true
  @Output() openChange = new EventEmitter<boolean>()
  @Output() decksUpdated = new EventEmitter<void>()

  deckName = ''
  deckDescription = ''

  constructor(
    private pbService: PocketBaseService,
    private toast: ToastService,
    private router: Router,
  ) {}

  ngOnInit() {
    if (this.deck) {
      this.deckName = this.deck.name || ''
      this.deckDescription = this.deck.description || ''
    }
  }

  openModal() {
    this.open = true
    this.openChange.emit(true)
  }

  async createDeck() {
    const userId = this.pbService.pb.authStore.record?.id
    if (!userId) {
      this.toast.add({ title: 'User not authenticated', color: 'error' })
      return
    }

    if (this.deck) {
      await this.pbService.pb.collection('decks').update(this.deck.id, {
        name: this.deckName,
        description: this.deckDescription,
      })
    } else {
      if (!this.roomId) {
        this.toast.add({ title: 'Room ID is required to create a deck', color: 'error' })
        return
      }
      await this.pbService.pb.collection('decks').create({
        name: this.deckName,
        description: this.deckDescription,
        creator: userId,
        roomId: this.roomId,
      })
    }

    this.decksUpdated.emit()
    this.open = false
    this.openChange.emit(false)
  }

  async deleteDeck() {
    if (!this.deck) return

    try {
      await this.pbService.pb.collection('decks').delete(this.deck.id)
      this.toast.add({ title: 'Deck deleted successfully', color: 'success' })
      this.decksUpdated.emit()
      this.open = false
      this.openChange.emit(false)
      await this.router.navigate([`/room/${this.deck.roomId}`])
    } catch (error) {
      this.toast.add({ title: 'Error', description: String(error), color: 'error' })
    }
  }
}
