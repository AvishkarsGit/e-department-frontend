import { NgClass, NgStyle } from '@angular/common';
import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-card',
  imports: [NgClass, NgStyle],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  isCardCollapse = signal<boolean>(false);
  isCardRemoved = signal<boolean>(false);

  readonly title = input.required<string>();
  readonly classes = input<string>();
  readonly headerClass = input<string>('bg-white text-muted');
  readonly iconColor = input<string>('text-muted');
  readonly isFooter = input<boolean>(false);

  toggleCardCollapse() {
    this.isCardCollapse.set(!this.isCardCollapse());
  }

  removeCard() {
    this.isCardRemoved.set(true);
  }
}
