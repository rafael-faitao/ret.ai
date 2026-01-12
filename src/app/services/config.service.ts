import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private readonly gridConfig = {
    targetSize: 20,
    color: '#DBDEE7',
    strokeWidth: 1
  };

  private readonly canvasConfig = {
    backgroundColor: '#f0f1f8'
  };

  getGridColor(): string {
    return this.gridConfig.color;
  }

  getGridTargetSize(): number {
    return this.gridConfig.targetSize;
  }

  getGridStrokeWidth(): number {
    return this.gridConfig.strokeWidth;
  }

  getCanvasBackgroundColor(): string {
    return this.canvasConfig.backgroundColor;
  }

  updateGridColor(color: string): void {
    this.gridConfig.color = color;
  }

  updateGridTargetSize(size: number): void {
    this.gridConfig.targetSize = size;
  }
}
