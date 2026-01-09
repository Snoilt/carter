import { Component, OnInit } from '@angular/core'
import { NgFor, NgIf } from '@angular/common'
import { RouterLink } from '@angular/router'
import type { RoomsResponse } from '../../types/pb'
import { PocketBaseService } from '../../core/services/pocketbase.service'
import { UserService } from '../../core/services/user.service'
import { ToastService } from '../../core/services/toast.service'
import { RoomCreatorComponent } from '../../components/room/room-creator.component'
import { RoomDropdownComponent } from '../../components/room/room-dropdown.component'

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, RoomCreatorComponent, RoomDropdownComponent],
  template: `
    <div class="space-y-6">
      <h1 class="section-title">Your Collections</h1>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <app-room-creator (created)="fetchCollections()">
          <button class="btn btn-outline" type="button">Create Collection</button>
        </app-room-creator>

        <div *ngIf="!loading && collections.length === 0" class="card p-4">
          <h2 class="font-semibold">No collections yet</h2>
          <p class="text-sm text-slate-500">Create your first collection to get started.</p>
        </div>

        <div *ngFor="let collection of collections" class="card p-4">
          <div class="flex items-center justify-between">
            <h2 class="font-semibold">{{ collection.name }}</h2>
            <app-room-dropdown
              [collection]="collection"
              (action)="fetchCollections()"
            ></app-room-dropdown>
          </div>
          <p class="mt-2 text-sm text-slate-500">{{ collection.description }}</p>
          <div class="mt-4">
            <a class="btn btn-outline w-full" [routerLink]="['/room', collection.id]">Join</a>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  collections: RoomsResponse[] = []
  loading = false

  constructor(
    private pbService: PocketBaseService,
    private userService: UserService,
    private toast: ToastService,
  ) {}

  async ngOnInit() {
    await this.fetchCollections()
  }

  async fetchCollections() {
    this.loading = true
    try {
      const user = this.userService.requireUser()
      const result = await this.pbService.pb.collection('rooms').getFullList<RoomsResponse>(undefined, {
        filter: `user ~ "${user.id}"`,
        sort: '-created',
      })
      this.collections = result
    } catch (error) {
      this.toast.add({ title: 'Error', description: String(error), color: 'error' })
    } finally {
      this.loading = false
    }
  }
}
