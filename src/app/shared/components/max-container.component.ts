import { Component } from '@angular/core'

@Component({
  selector: 'app-max-container',
  standalone: true,
  template: `<div class="flex min-h-[calc(100vh-var(--header-height))] w-full">
    <ng-content />
  </div>`,
})
export class MaxContainerComponent {}
