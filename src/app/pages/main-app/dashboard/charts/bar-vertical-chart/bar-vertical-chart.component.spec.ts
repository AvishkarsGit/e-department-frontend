import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarVerticalChartComponent } from './bar-vertical-chart.component';

describe('BarVerticalChartComponent', () => {
  let component: BarVerticalChartComponent;
  let fixture: ComponentFixture<BarVerticalChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarVerticalChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarVerticalChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
