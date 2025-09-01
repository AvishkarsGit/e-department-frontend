import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDatepickerFormComponent } from './mat-datepicker-form.component';

describe('MatDatepickerFormComponent', () => {
  let component: MatDatepickerFormComponent;
  let fixture: ComponentFixture<MatDatepickerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDatepickerFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatDatepickerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
