import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatepipeTextFormatComponent } from './datepipe-text-format.component';

describe('DatepipeTextFormatComponent', () => {
  let component: DatepipeTextFormatComponent;
  let fixture: ComponentFixture<DatepipeTextFormatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatepipeTextFormatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatepipeTextFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
