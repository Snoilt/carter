import { Component, EventEmitter, Input, Output } from '@angular/core'
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-card-editor',
  standalone: true,
  imports: [FormsModule],
  template: `
    <textarea
      class="input min-h-[150px]"
      [placeholder]="placeholder"
      [(ngModel)]="modelValue"
      (ngModelChange)="modelValueChange.emit($event)"
    ></textarea>
  `,
})
export class CardEditorComponent {
  @Input() modelValue = ''
  @Input() placeholder = 'hmmm...'
  @Output() modelValueChange = new EventEmitter<string>()
}
