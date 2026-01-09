import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { NgIf } from '@angular/common'
import type { RoomsRecord } from '../../../types/pb'
import { PocketBaseService } from '../../../core/services/pocketbase.service'
import { RoomDecksComponent } from '../../../components/room/room-decks.component'
import { RoomUsersComponent } from '../../../components/room/room-users.component'

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [NgIf, RoomDecksComponent, RoomUsersComponent],
  template: `
    <div *ngIf="currentRoom" class="grid gap-6 md:grid-cols-2">
      <app-room-decks [room]="currentRoom"></app-room-decks>
      <div class="space-y-3">
        <h1 class="section-title">Members</h1>
        <app-room-users [collection]="currentRoom"></app-room-users>
      </div>
    </div>
  `,
})
export class RoomComponent implements OnInit {
  currentRoom?: RoomsRecord

  constructor(private route: ActivatedRoute, private pbService: PocketBaseService) {}

  async ngOnInit() {
    const roomId = this.route.snapshot.paramMap.get('room')
    if (!roomId) return

    try {
      this.currentRoom = await this.pbService.pb.collection('rooms').getOne(roomId, {
        expand: 'user.name',
      })
    } catch (error) {
      console.error('Failed to fetch room:', error)
    }
  }
}
