import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleFormButtonComponent } from './toggle-form-button.component';

describe('ToggleFormButtonComponent', () => {
  let component: ToggleFormButtonComponent;
  let fixture: ComponentFixture<ToggleFormButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToggleFormButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToggleFormButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
