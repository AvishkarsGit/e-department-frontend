import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFilterInputComponent } from './search-filter-input.component';

describe('SearchFilterInputComponent', () => {
  let component: SearchFilterInputComponent;
  let fixture: ComponentFixture<SearchFilterInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchFilterInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchFilterInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
