import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconRoundButtonComponent } from './icon-round-button.component';

describe('IconRoundButtonComponent', () => {
  let component: IconRoundButtonComponent;
  let fixture: ComponentFixture<IconRoundButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconRoundButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconRoundButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
