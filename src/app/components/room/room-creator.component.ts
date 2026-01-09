import { Component, EventEmitter, Input, Output } from '@angular/core'
import { NgIf } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ModalComponent } from '../../shared/components/modal.component'
import { PocketBaseService } from '../../core/services/pocketbase.service'
import { UserService } from '../../core/services/user.service'
import { ToastService } from '../../core/services/toast.service'

@Component({
  selector: 'app-room-creator',
  standalone: true,
  imports: [FormsModule, ModalComponent, NgIf],
  template: `
    <div *ngIf="showTrigger" class="inline-block" (click)="openModal()">
      <ng-content></ng-content>
    </div>

    <app-modal
      [title]="'Create a new Collection'"
      [(open)]="open"
      (openChange)="openChange.emit($event)"
    >
      <div modal-body class="space-y-4">
        <label class="block text-sm font-medium">Collection Title</label>
        <input
          class="input"
          type="text"
          placeholder="Biology"
          [(ngModel)]="collectionTitle"
        />
        <label class="block text-sm font-medium">Description (optional)</label>
        <input
          class="input"
          type="text"
          placeholder="My Biology Collection"
          [(ngModel)]="collectionDescription"
        />
        <label class="block text-sm font-medium">Share with Others</label>
        <input
          class="input"
          type="text"
          placeholder="Press enter to add E-Mails"
          [(ngModel)]="emails"
        />
      </div>
      <div modal-footer>
        <button class="btn btn-primary w-full" type="button" (click)="createCollection()">
          Create Deck
        </button>
      </div>
    </app-modal>
  `,
})
export class RoomCreatorComponent {
  @Input() open = false
  @Input() showTrigger = true
  @Output() openChange = new EventEmitter<boolean>()
  @Output() created = new EventEmitter<void>()

  collectionTitle = ''
  collectionDescription = ''
  emails = ''

  constructor(
    private pbService: PocketBaseService,
    private userService: UserService,
    private toast: ToastService,
  ) {}

  openModal() {
    this.open = true
    this.openChange.emit(true)
  }

  async createCollection() {
    try {
      const user = this.userService.requireUser()
      await this.pbService.pb.collection('rooms').create({
        id: '',
        user: [user.id],
        creator: user.id,
        name: this.collectionTitle,
        description: this.collectionDescription,
      })
      this.toast.add({ title: 'Deck created successfully', color: 'success' })
      this.created.emit()
      this.open = false
      this.openChange.emit(false)
    } catch (error) {
      this.toast.add({ title: 'Error', description: String(error), color: 'error' })
    }
  }
}
