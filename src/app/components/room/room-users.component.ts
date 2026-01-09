import { Component, Input, OnInit } from '@angular/core'
import { NgFor, NgIf } from '@angular/common'
import type { RoomsRecord, RoomsUserInfoResponse } from '../../types/pb'
import { PocketBaseService } from '../../core/services/pocketbase.service'

@Component({
  selector: 'app-room-users',
  standalone: true,
  imports: [NgFor, NgIf],
  template: `
    <div class="space-y-3">
      <div
        *ngFor="let user of deckUsers"
        class="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3"
      >
        <div class="h-10 w-10 rounded-full bg-slate-200" *ngIf="!userAvatar(user)"></div>
        <img
          *ngIf="userAvatar(user)"
          class="h-10 w-10 rounded-full object-cover"
          [src]="userAvatar(user)"
          [alt]="user.userName"
        />
        <div>
          <p class="text-sm font-semibold">{{ user.userName }}</p>
          <p class="text-xs text-slate-500">last played yesterday</p>
        </div>
      </div>
    </div>
  `,
})
export class RoomUsersComponent implements OnInit {
  @Input() collection!: RoomsRecord
  deckUsers: RoomsUserInfoResponse[] = []

  constructor(private pbService: PocketBaseService) {}

  async ngOnInit() {
    this.deckUsers = await this.pbService.pb.collection('rooms_user_info').getFullList({
      filter: `rooms = "${this.collection.id}"`,
    })
  }

  userAvatar(user: RoomsUserInfoResponse) {
    if (!user.userAvatar) return ''
    return this.pbService.pb.files.getURL(user, user.userAvatar)
  }
}
