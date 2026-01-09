import { Component, Input, OnInit } from '@angular/core'
import { NgFor, NgIf } from '@angular/common'
import { RouterLink } from '@angular/router'
import type { DecksRecord, RoomsRecord } from '../../types/pb'
import { PocketBaseService } from '../../core/services/pocketbase.service'
import { DeckCreatorComponent } from '../deck/deck-creator.component'

@Component({
  selector: 'app-room-decks',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, DeckCreatorComponent],
  template: `
    <div class="space-y-4">
      <h1 class="section-title">Decks</h1>
      <div *ngFor="let deck of decks" class="card p-4">
        <h2 class="text-lg font-semibold">{{ deck.name }}</h2>
        <p class="text-sm text-slate-500">{{ deck.description }}</p>
        <div class="mt-4 flex gap-2">
          <a class="btn btn-outline" [routerLink]="['/room', room.id, 'play', deck.id]">
            Play
          </a>
          <a class="btn btn-outline" [routerLink]="['/room', room.id, 'deck', deck.id]">
            Edit
          </a>
          <button class="btn btn-outline" type="button">Info</button>
        </div>
      </div>

      <app-deck-creator [roomId]="room.id" (decksUpdated)="fetchDecks()">
        <button class="btn btn-primary" type="button">Create new Deck</button>
      </app-deck-creator>
    </div>
  `,
})
export class RoomDecksComponent implements OnInit {
  @Input() room!: RoomsRecord
  decks: DecksRecord[] = []

  constructor(private pbService: PocketBaseService) {}

  async ngOnInit() {
    await this.fetchDecks()
  }

  async fetchDecks() {
    this.decks = await this.pbService.pb
      .collection('decks')
      .getFullList({ filter: `roomId = "${this.room.id}"` })
  }
}
