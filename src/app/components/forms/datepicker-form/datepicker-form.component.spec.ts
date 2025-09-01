import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatepickerFormComponent } from './datepicker-form.component';

describe('DatepickerFormComponent', () => {
  let component: DatepickerFormComponent;
  let fixture: ComponentFixture<DatepickerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatepickerFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatepickerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
