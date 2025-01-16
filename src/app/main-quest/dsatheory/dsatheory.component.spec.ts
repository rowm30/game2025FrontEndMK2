import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsatheoryComponent } from './dsatheory.component';

describe('DsatheoryComponent', () => {
  let component: DsatheoryComponent;
  let fixture: ComponentFixture<DsatheoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DsatheoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DsatheoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
