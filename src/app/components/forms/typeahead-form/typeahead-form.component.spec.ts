import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeaheadFormComponent } from './typeahead-form.component';

describe('TypeaheadFormComponent', () => {
  let component: TypeaheadFormComponent;
  let fixture: ComponentFixture<TypeaheadFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypeaheadFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeaheadFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
