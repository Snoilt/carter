import { Injectable } from '@angular/core'
import type { AuthRecord } from 'pocketbase'
import { PocketBaseService } from './pocketbase.service'
import type { RoomsResponse } from '../../types/pb'
import { ToastService } from './toast.service'

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private pbService: PocketBaseService, private toast: ToastService) {}

  get record(): AuthRecord | null {
    return this.pbService.pb.authStore.record
  }

  requireUser() {
    const user = this.record
    if (!user) {
      this.toast.add({ title: 'Error', description: 'User record not available.', color: 'error' })
      throw new Error('User record not available')
    }
    return user
  }

  getRole(collection: RoomsResponse): 0 | 1 | 2 {
    const user = this.record
    if (!user) return 0
    if (user.id === collection.creator) return 2
    if (collection.admins && collection.admins.includes(user.id)) return 1
    return 0
  }

  async getCollections() {
    return this.pbService.pb.collection('rooms').getFullList<RoomsResponse>()
  }
}
