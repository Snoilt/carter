import { Injectable } from '@angular/core'
import PocketBase from 'pocketbase'
import type { TypedPocketBase } from '../../types/pb'

@Injectable({ providedIn: 'root' })
export class PocketBaseService {
  readonly pb: TypedPocketBase

  constructor() {
    this.pb = new PocketBase('http://127.0.0.1:8090') as TypedPocketBase
  }
}
