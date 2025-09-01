import {
  Directive,
  HostListener,
  input,
  output,
  signal,
} from '@angular/core';

@Directive({
  selector: '[appDebounce]',
})
export class DebounceDirective {

  private valueSignal = signal<string>(''); // Signal to hold input value
  private timerSignal = signal<any>(null); // To track and clear the timer

  readonly debounceTime = input<number>(300); // Debounce time in ms
  readonly debouncedInput = output<string>();

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.valueSignal.set(value); // Update value signal immediately

    // Clear any previous timer
    if (this.timerSignal()) {
      clearTimeout(this.timerSignal());
    }

    // Set a new timer with the debounce time
    const timerId = setTimeout(() => {
      this.debouncedInput.emit(this.valueSignal()); // Emit the debounced value
    }, this.debounceTime());

    this.timerSignal.set(timerId); // Store the timer ID to clear it later
  }

}
