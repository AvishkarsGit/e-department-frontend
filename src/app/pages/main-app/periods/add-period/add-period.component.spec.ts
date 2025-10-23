import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPeriodComponent } from './add-period.component';

describe('AddPeriodComponent', () => {
  let component: AddPeriodComponent;
  let fixture: ComponentFixture<AddPeriodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPeriodComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
