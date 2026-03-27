import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryvisualizerComponent } from './historyvisualizer.component';

describe('HistoryvisualizerComponent', () => {
  let component: HistoryvisualizerComponent;
  let fixture: ComponentFixture<HistoryvisualizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryvisualizerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoryvisualizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
