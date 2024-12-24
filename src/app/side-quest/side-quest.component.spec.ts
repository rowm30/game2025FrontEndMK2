import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideQuestComponent } from './side-quest.component';

describe('SideQuestComponent', () => {
  let component: SideQuestComponent;
  let fixture: ComponentFixture<SideQuestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideQuestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideQuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
