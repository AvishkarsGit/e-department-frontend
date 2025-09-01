import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderOptionsComponent } from './header-options.component';

describe('HeaderOptionsComponent', () => {
  let component: HeaderOptionsComponent;
  let fixture: ComponentFixture<HeaderOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderOptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
