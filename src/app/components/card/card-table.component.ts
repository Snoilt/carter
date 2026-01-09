import { Component, Input, OnInit } from '@angular/core'
import { NgFor } from '@angular/common'
import type { CardsRecord, DecksRecord } from '../../types/pb'
import { PocketBaseService } from '../../core/services/pocketbase.service'
import { CardHandlerComponent } from './card-handler.component'

@Component({
  selector: 'app-card-table',
  standalone: true,
  imports: [NgFor, CardHandlerComponent],
  template: `
    <div class="overflow-x-auto">
      <table class="min-w-full border border-slate-200 text-sm">
        <thead class="bg-slate-100">
          <tr>
            <th class="px-4 py-2 text-left">Edit</th>
            <th class="px-4 py-2 text-left">Front</th>
            <th class="px-4 py-2 text-left">Back</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let card of cards" class="border-t">
            <td class="px-4 py-2">
              <app-card-handler [card]="card" [deck]="deck" (cardUpdate)="fetchCards()">
                <button class="btn btn-outline" type="button">Edit</button>
              </app-card-handler>
            </td>
            <td class="px-4 py-2">{{ card.question }}</td>
            <td class="px-4 py-2">{{ card.solution }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-4">
      <app-card-handler [deck]="deck" (cardUpdate)="fetchCards()">
        <button class="btn btn-primary" type="button">New Card</button>
      </app-card-handler>
    </div>
  `,
})
export class CardTableComponent implements OnInit {
  @Input() deck!: DecksRecord
  cards: CardsRecord[] = []

  constructor(private pbService: PocketBaseService) {}

  async ngOnInit() {
    await this.fetchCards()
  }

  async fetchCards() {
    this.cards = await this.pbService.pb
      .collection('cards')
      .getFullList({ filter: `deck = "${this.deck.id}"` })
  }
}
