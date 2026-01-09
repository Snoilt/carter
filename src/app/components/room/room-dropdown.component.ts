import { Component, EventEmitter, Input, Output } from '@angular/core'
import { NgFor, NgIf } from '@angular/common'
import type { RoomsResponse } from '../../types/pb'
import { UserService } from '../../core/services/user.service'
import { PocketBaseService } from '../../core/services/pocketbase.service'
import { RoomCreatorComponent } from './room-creator.component'

@Component({
  selector: 'app-room-dropdown',
  standalone: true,
  imports: [NgIf, NgFor, RoomCreatorComponent],
  template: `
    <app-room-creator
      [(open)]="isModalOpen"
      [showTrigger]="false"
      (created)="action.emit()"
    ></app-room-creator>

    <div class="relative inline-block">
      <button class="btn btn-outline" type="button" (click)="toggleMenu()">⋯</button>
      <div
        *ngIf="isOpen"
        class="absolute right-0 mt-2 w-40 rounded-md border border-slate-200 bg-white shadow-lg"
      >
        <button
          *ngFor="let item of items"
          class="block w-full px-3 py-2 text-left text-sm hover:bg-slate-100"
          type="button"
          (click)="item.onSelect()"
        >
          {{ item.label }}
        </button>
      </div>
    </div>
  `,
})
export class RoomDropdownComponent {
  @Input() collection!: RoomsResponse
  @Output() action = new EventEmitter<void>()

  isOpen = false
  isModalOpen = false

  constructor(private userService: UserService, private pbService: PocketBaseService) {}

  get items() {
    return [
      {
        label: 'Edit',
        show: this.userService.getRole(this.collection) >= 1,
        onSelect: () => {
          this.isModalOpen = true
          this.isOpen = false
        },
      },
      {
        label: 'Share',
        show: true,
        onSelect: () => {
          this.isOpen = false
        },
      },
      {
        label: 'Remove',
        show: true,
        onSelect: async () => {
          await this.pbService.pb.send(`/api/room/leave/${this.collection.id}`, {
            method: 'GET',
          })
          this.action.emit()
          this.isOpen = false
        },
      },
    ].filter((item) => item.show)
  }

  toggleMenu() {
    this.isOpen = !this.isOpen
  }
}
