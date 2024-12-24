import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainQuestComponent } from './main-quest.component';

describe('MainQuestComponent', () => {
  let component: MainQuestComponent;
  let fixture: ComponentFixture<MainQuestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainQuestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainQuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
