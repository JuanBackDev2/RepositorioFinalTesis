import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetinopathyGradingComponent } from './retinopathy-grading.component';

describe('RetinopathyGradingComponent', () => {
  let component: RetinopathyGradingComponent;
  let fixture: ComponentFixture<RetinopathyGradingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RetinopathyGradingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetinopathyGradingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
