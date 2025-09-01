import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressInfoBoxComponent } from './progress-info-box.component';

describe('ProgressInfoBoxComponent', () => {
  let component: ProgressInfoBoxComponent;
  let fixture: ComponentFixture<ProgressInfoBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgressInfoBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressInfoBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
