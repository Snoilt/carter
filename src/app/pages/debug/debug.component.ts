import { Component } from '@angular/core'
import { PocketBaseService } from '../../core/services/pocketbase.service'

@Component({
  selector: 'app-debug',
  standalone: true,
  template: `
    <div class="space-x-3">
      <button class="btn btn-outline" type="button" (click)="review()">Test review endpoint</button>
      <button class="btn btn-outline" type="button" (click)="nextCard()">Test next Card endpoint</button>
      <button class="btn btn-outline" type="button" (click)="goEndPoint()">
        Test review GET endpoint
      </button>
    </div>
  `,
})
export class DebugComponent {
  constructor(private pbService: PocketBaseService) {}

  async review() {
    try {
      console.log(
        await this.pbService.pb.send('/api/learn/review', {
          method: 'POST',
          body: JSON.stringify({
            userCardId: 'dcsfzgeel4ym54x',
            rating: 4,
            attemptId: 'testattemptid21',
          }),
        }),
      )
    } catch (error) {
      console.error('Failed to review card:', error)
    }
  }

  async nextCard() {
    try {
      const response = await this.pbService.pb.send('/api/learn/next/wgq3p3dgkri7e97', {
        method: 'GET',
      })
      console.log(response)
    } catch (error) {
      console.error('Failed to review card:', error)
    }
  }

  async goEndPoint() {
    try {
      const response = await this.pbService.pb.send('/api/learn/review', {
        method: 'GET',
      })
      console.log(response)
    } catch (error) {
      console.error('Failed to review card:', error)
    }
  }
}
