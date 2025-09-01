import {
  Component,
  effect,
  ElementRef,
  input,
  model,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { TypeaheadMatch, TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { DebounceDirective } from '../../../directives/debounce/debounce.directive';
import { IconButtonComponent } from '../../buttons/icon-button/icon-button.component';

@Component({
  selector: 'app-typeahead-form',
  imports: [
    ReactiveFormsModule,
    TypeaheadModule,
    DebounceDirective,
    IconButtonComponent,
  ],
  templateUrl: './typeahead-form.component.html',
  styleUrl: './typeahead-form.component.scss',
})
export class TypeaheadFormComponent {
  @ViewChild('typeaheadInput', { static: true })
  typeaheadInput?: ElementRef<HTMLInputElement>;

  readonly data = input<any[]>([]);
  readonly label = input<string>();
  readonly type = input<string>('text');
  readonly icon = input<string>();
  readonly endText = input<string>();
  readonly required = input<boolean>(true);
  readonly placeholder = input<string>();
  readonly debounce = input<number>(500);
  readonly displayField = input<string>('name');
  readonly endButton = input<boolean>(false);
  readonly buttonIcon = input<string>('add');
  // readonly control = input<any>();

  readonly control = input<AbstractControl | null>();

  get controlInput(): FormControl {
    const raw = this.control();
    return raw instanceof FormControl ? raw : new FormControl();
  }

  query = output<string>();
  onSelected = output<any>();
  onButtonClick = output<any>();

  updateSearchData = model<boolean>(false);
  private skipNextInputEmit = signal<boolean>(false);

  constructor() {
    effect(() => {
      if (this.updateSearchData()) {
        // set typeahead data
        console.log('update search result');
        this.refreshTypeahead();
        this.updateSearchData.set(false);
      }
    });
  }

  setSkipNextInputEmit(value: boolean) {
    this.skipNextInputEmit.set(value);
  }

  refreshTypeahead() {
    this.setSkipNextInputEmit(true);

    setTimeout(() => {
      const input = this.typeaheadInput?.nativeElement;
      console.log(input);

      if (input) {
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
  }

  onChange(query: any) {
    if (this.skipNextInputEmit()) {
      this.setSkipNextInputEmit(false);
      return; // prevent loop
    }

    this.query.emit(query);
  }

  onSelect(event: TypeaheadMatch) {
    const item = event.item;
    console.log(item);
    this.onSelected.emit(item);
  }

  buttonTapped(event: any) {
    this.onButtonClick.emit(event);
  }
}
