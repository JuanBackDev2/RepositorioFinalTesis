import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosticViewerComponent } from './diagnostic-viewer.component';

describe('DiagnosticViewerComponent', () => {
  let component: DiagnosticViewerComponent;
  let fixture: ComponentFixture<DiagnosticViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiagnosticViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiagnosticViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
