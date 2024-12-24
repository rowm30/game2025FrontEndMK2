import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestSelectionComponent } from './quest-selection.component';

describe('QuestSelectionComponent', () => {
  let component: QuestSelectionComponent;
  let fixture: ComponentFixture<QuestSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestSelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
