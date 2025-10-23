import { Component, input, output, signal } from '@angular/core';
import { DebounceDirective } from '../../directives/debounce/debounce.directive';

@Component({
  selector: 'app-search-filter-input',
  imports: [DebounceDirective],
  templateUrl: './search-filter-input.component.html',
  styleUrl: './search-filter-input.component.scss',
})
export class SearchFilterInputComponent {
  data = input<any[]>([]);
  fields = input<string[]>([]);
  isSSR = input<boolean>(true);


  filteredData = output<any>();

  updateFilter(event: string) {
    // const val = event.target.value.toLowerCase();
    const val = event.toLowerCase();

    // if server side rendering
    if (this.isSSR()) {
      this.filteredData.emit(val);
      return;
    }

    if (!this.data() || this.fields().length === 0) {
      this.filteredData.emit(this.data());
      return;
    }

    const filtered = this.data().filter((item) =>
      this.fields().some((field) =>
        this.getFieldValue(item, field)?.toLowerCase().includes(val)
      )
    );

    this.filteredData.emit(filtered);
  }

  // Helper function to get nested values safely
  private getFieldValue(obj: any, path: string): string {
    return path.split('.').reduce((acc, key) => acc?.[key], obj) || '';
  }
}
