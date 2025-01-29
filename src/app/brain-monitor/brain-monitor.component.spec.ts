import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrainMonitorComponent } from './brain-monitor.component';

describe('BrainMonitorComponent', () => {
  let component: BrainMonitorComponent;
  let fixture: ComponentFixture<BrainMonitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrainMonitorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrainMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
