import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { NgIf } from '@angular/common'
import type { DecksRecord } from '../../../types/pb'
import { PocketBaseService } from '../../../core/services/pocketbase.service'
import { DeckCreatorComponent } from '../../../components/deck/deck-creator.component'
import { CardTableComponent } from '../../../components/card/card-table.component'

@Component({
  selector: 'app-room-deck',
  standalone: true,
  imports: [NgIf, DeckCreatorComponent, CardTableComponent],
  template: `
    <div *ngIf="deck" class="space-y-4">
      <div class="card p-4">
        <h1 class="text-lg font-semibold">Currently Editing</h1>
        <div class="mt-4 flex items-center justify-between gap-4">
          <div>
            <p class="font-bold">{{ deck.name }}</p>
            <p class="text-sm text-slate-500">{{ deck.description }}</p>
          </div>
          <app-deck-creator [deck]="deck" (decksUpdated)="fetchDeck()">
            <button class="btn btn-outline" type="button">Edit</button>
          </app-deck-creator>
        </div>
      </div>

      <app-card-table [deck]="deck"></app-card-table>
    </div>
  `,
})
export class RoomDeckComponent implements OnInit {
  deck?: DecksRecord

  constructor(private route: ActivatedRoute, private pbService: PocketBaseService) {}

  async ngOnInit() {
    await this.fetchDeck()
  }

  async fetchDeck() {
    const deckId = this.route.snapshot.paramMap.get('deck')
    if (!deckId) return

    try {
      this.deck = await this.pbService.pb.collection('decks').getOne(deckId)
    } catch (error) {
      console.error('Failed to fetch deck:', error)
    }
  }
}
