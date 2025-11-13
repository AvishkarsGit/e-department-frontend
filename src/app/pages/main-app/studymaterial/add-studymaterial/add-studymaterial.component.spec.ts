import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStudymaterialComponent } from './add-studymaterial.component';

describe('AddStudymaterialComponent', () => {
  let component: AddStudymaterialComponent;
  let fixture: ComponentFixture<AddStudymaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddStudymaterialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddStudymaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
