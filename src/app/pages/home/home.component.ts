import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { MaxContainerComponent } from '../../shared/components/max-container.component'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, MaxContainerComponent],
  template: `
    <app-max-container>
      <div class="m-auto w-full max-w-md">
        <div class="card p-6 text-center">
          <h1 class="text-3xl font-bold">Welcome to Carter</h1>
          <p class="text-slate-600">Your Ultimate Flashcard experience</p>
          <div class="mt-6 flex flex-wrap justify-center gap-3">
            <a class="btn btn-primary" routerLink="/auth/login">Let me Play!</a>
            <button class="btn btn-outline" type="button">What is Carter?</button>
          </div>
        </div>
      </div>
    </app-max-container>
  `,
})
export class HomeComponent {}
