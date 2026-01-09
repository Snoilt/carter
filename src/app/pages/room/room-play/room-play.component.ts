import { Component, HostListener, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { NgIf } from '@angular/common'
import type { CardsRecord } from '../../../types/pb'
import { PocketBaseService } from '../../../core/services/pocketbase.service'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

@Component({
  selector: 'app-room-play',
  standalone: true,
  imports: [NgIf],
  template: `
    <div class="flex min-h-[70vh] flex-col items-center justify-center p-4">
      <div *ngIf="cards.length === 0" class="text-center text-slate-500">
        Loading cards...
      </div>

      <div *ngIf="cards.length > 0 && isFinished" class="text-center">
        <h2 class="mb-4 text-2xl font-bold">🎉 You've finished all cards!</h2>
        <p class="text-slate-500">{{ cards.length }} cards reviewed</p>
      </div>

      <div *ngIf="cards.length > 0 && !isFinished" class="w-full max-w-2xl">
        <div class="mb-4 text-center text-sm text-slate-500">
          Card {{ currentIndex + 1 }} of {{ cards.length }}
        </div>

        <div class="card min-h-64 p-8">
          <div class="mb-6">
            <h3 class="mb-2 text-lg font-semibold text-slate-500">Question</h3>
            <div [innerHTML]="renderedQuestion"></div>
          </div>

          <div *ngIf="showAnswer" class="border-t pt-6">
            <h3 class="mb-2 text-lg font-semibold text-slate-500">Answer</h3>
            <div class="text-lg" [innerHTML]="renderedAnswer"></div>
          </div>
        </div>

        <p class="mt-6 text-center text-sm text-slate-400">
          <span class="rounded bg-slate-200 px-2 py-1">1 Again</span>
          <span class="rounded bg-slate-200 px-2 py-1">2 Hard</span>
          <span class="rounded bg-slate-200 px-2 py-1">3 Good</span>
          <span class="rounded bg-slate-200 px-2 py-1">4 Easy</span>
          <span class="rounded bg-slate-200 px-2 py-1">Space</span>
          {{ showAnswer ? 'for next card' : 'to reveal answer' }}
        </p>
      </div>
    </div>
  `,
})
export class RoomPlayComponent implements OnInit {
  cards: CardsRecord[] = []
  currentIndex = 0
  showAnswer = false

  constructor(
    private route: ActivatedRoute,
    private pbService: PocketBaseService,
    private sanitizer: DomSanitizer,
  ) {}

  get currentCard() {
    return this.cards[this.currentIndex]
  }

  get isFinished() {
    return this.currentIndex >= this.cards.length
  }

  get renderedQuestion(): SafeHtml {
    return this.renderMarkdown(this.currentCard?.question || '')
  }

  get renderedAnswer(): SafeHtml {
    return this.renderMarkdown(this.currentCard?.solution || '')
  }

  @HostListener('document:keydown', ['$event'])
  handleSpacebar(event: KeyboardEvent) {
    if (event.code !== 'Space') return
    event.preventDefault()
    if (this.isFinished) return

    if (this.showAnswer) {
      this.showAnswer = false
      this.currentIndex += 1
    } else {
      this.showAnswer = true
    }
  }

  async ngOnInit() {
    await this.fetchCards()
  }

  async fetchCards() {
    const deckId = this.route.snapshot.paramMap.get('deck')
    if (!deckId) return

    this.cards = await this.pbService.pb
      .collection('cards')
      .getFullList({ filter: `deck = "${deckId}"` })
  }

  private renderMarkdown(content: string): SafeHtml {
    const raw = marked.parse(content)
    const sanitized = DOMPurify.sanitize(raw)
    return this.sanitizer.bypassSecurityTrustHtml(sanitized)
  }
}
