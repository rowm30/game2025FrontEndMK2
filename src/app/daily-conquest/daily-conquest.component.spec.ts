import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyConquestComponent } from './daily-conquest.component';

describe('DailyConquestComponent', () => {
  let component: DailyConquestComponent;
  let fixture: ComponentFixture<DailyConquestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyConquestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyConquestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
