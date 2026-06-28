import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFacultiesComponent } from './add-faculties.component';

describe('AddFacultiesComponent', () => {
  let component: AddFacultiesComponent;
  let fixture: ComponentFixture<AddFacultiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddFacultiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFacultiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
