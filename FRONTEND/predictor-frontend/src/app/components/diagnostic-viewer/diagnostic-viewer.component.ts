import { Component, Input,EventEmitter,  Output, ViewChild, ElementRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-diagnostic-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './diagnostic-viewer.component.html',
})
export class DiagnosticViewerComponent {
  @Input() imageUrl: string = '';
  zoomLevel: number = 1.0;
  translateX = 0;
  translateY = 0;
  showError = false;
  isDragging = false;
  startX = 0;
  startY = 0;
  @Output() predictionReady = new EventEmitter<any>();
  selectedFile!: File;
  imagePreview: string | ArrayBuffer | null = null;
  @ViewChild('container') containerRef!: ElementRef;
  @ViewChild('imageWrapper') imageRef!: ElementRef;
  isProcessing = false;

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];

    if (!allowedTypes.includes(file.type)) {
      this.showError = true;

      // limpiar input (importante)
      event.target.value = '';
      return;
    }

    this.selectedFile = file;

    // Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);

    this.upload();
  }

  upload() {
    const formData = new FormData();
    formData.append('image', this.selectedFile);

    this.isProcessing = true;

    this.http.post('/api/predict/', formData)
      .subscribe({
        next: (res:any) => {
          console.log(res);
          this.predictionReady.emit(res);
          this.isProcessing = false;
          
        },
        error: (err:any) => {
          console.error(err);
          this.isProcessing = false;
          
        }
      });
  }


  adjustZoom(delta: number) {
    const newZoom = Math.max(1, Math.min(3, this.zoomLevel + delta));

    this.zoomLevel = newZoom;

    this.limitTranslation(); // 🔥 recalcula límites después del zoom

    // 🔥 si vuelve a 1 → centra todo
    if (this.zoomLevel === 1) {
      this.translateX = 0;
      this.translateY = 0;
    }
  }

  resetZoom() {
    this.zoomLevel = 1.0;
    this.translateX = 0;
    this.translateY = 0;
  }

  onMouseDown(event: MouseEvent) {
  if (this.zoomLevel <= 1) return; // 🔥 solo mover si hay zoom

  this.isDragging = true;
  this.startX = event.clientX - this.translateX;
  this.startY = event.clientY - this.translateY;
}

onMouseMove(event: MouseEvent) {
  if (!this.isDragging) return;

  const dx = event.clientX - this.startX;
  const dy = event.clientY - this.startY;

  this.startX = event.clientX;
  this.startY = event.clientY;

  this.translateX += dx;
  this.translateY += dy;

  this.limitTranslation(); // 🔥 clave
}

onMouseUp() {
  this.isDragging = false;
}

limitTranslation() {
  const container = this.containerRef.nativeElement;
  const image = this.imageRef.nativeElement;

  const containerWidth = container.offsetWidth;
  const containerHeight = container.offsetHeight;

  const imageWidth = image.offsetWidth * this.zoomLevel;
  const imageHeight = image.offsetHeight * this.zoomLevel;

  const maxX = (imageWidth - containerWidth) / 2;
  const maxY = (imageHeight - containerHeight) / 2;

  this.translateX = Math.max(-maxX, Math.min(maxX, this.translateX));
  this.translateY = Math.max(-maxY, Math.min(maxY, this.translateY));
}
}