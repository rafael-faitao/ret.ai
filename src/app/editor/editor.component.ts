import { Component, ElementRef, ViewChild, AfterViewInit, inject } from '@angular/core';
import Konva from 'konva';
import { ConfigService } from '../services/config.service';
import { ProductShelf } from '../domain/models/product-shelf.model';
import { RetailLayout } from '../domain/models/retail-layout.model';
import { MockService } from '../services/mock.service';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss'
})
export class EditorComponent implements AfterViewInit {
  @ViewChild('konvaContainer', { static: false }) konvaContainer!: ElementRef;
  private stage!: Konva.Stage;
  private layer!: Konva.Layer;
  private bgLayer!: Konva.Layer;

  private gridSize: number = 20;
  private configService = inject(ConfigService);
  private mockService = inject(MockService);
  private activeRetailLayout: RetailLayout | null = null;
  private shelfShapeMap: Map<Konva.Rect, ProductShelf> = new Map();

  ngAfterViewInit(): void {
    this.initKonva();
  }

  getActiveLayout(): RetailLayout | null {
    return this.activeRetailLayout;
  }

  private initKonva(): void {
    const container = this.konvaContainer.nativeElement;
    const size = Math.min(container.offsetWidth, container.offsetHeight);

    // Calculate gridSize to fit perfectly
    const targetGridSize = this.configService.getGridTargetSize();
    const gridCount = Math.round(size / targetGridSize);
    this.gridSize = size / gridCount;

    this.stage = new Konva.Stage({
      container: container,
      width: size,
      height: size,
    });

    this.bgLayer = new Konva.Layer();
    this.stage.add(this.bgLayer);

    // Add background
    const background = new Konva.Rect({
      x: 0,
      y: 0,
      width: size,
      height: size,
      fill: this.configService.getCanvasBackgroundColor(),
    });
    this.bgLayer.add(background);

    this.drawGrid(size);

    this.layer = new Konva.Layer();
    this.stage.add(this.layer);

    // Todo: remove after testing
    this.debugTest();

  }

  private drawGrid(size: number): void {
    const gridColor = this.configService.getGridColor();
    const strokeWidth = this.configService.getGridStrokeWidth();

    // Draw vertical lines
    for (let i = 0; i <= size; i += this.gridSize) {
      const line = new Konva.Line({
        points: [i, 0, i, size],
        stroke: gridColor,
        strokeWidth: strokeWidth,
      });
      this.bgLayer.add(line);
    }

    // Draw horizontal lines
    for (let i = 0; i <= size; i += this.gridSize) {
      const line = new Konva.Line({
        points: [0, i, size, i],
        stroke: gridColor,
        strokeWidth: strokeWidth,
      });
      this.bgLayer.add(line);
    }

    this.bgLayer.draw();
  }

  private drawProductShelf(shelf: ProductShelf): void {
    const rect = new Konva.Rect({
      x: shelf.x,
      y: shelf.y,
      width: shelf.width,
      height: shelf.height,
      fill: shelf.color,
      rotation: shelf.orientation,
      offsetX: shelf.width / 2,
      offsetY: shelf.height / 2,
      draggable: true,
    });

    // Track the shape-model relationship
    this.shelfShapeMap.set(rect, shelf);

    // Add drag event listeners to sync state
    rect.on('dragmove', () => this.onShelfDrag(rect));
    rect.on('dragend', () => this.onShelfDragEnd(rect));

    this.layer.add(rect);
    this.layer.draw();
  }

  private onShelfDrag(shape: Konva.Rect): void {
    const shelf = this.shelfShapeMap.get(shape);
    if (shelf) {
      shelf.x = shape.x();
      shelf.y = shape.y();
    }
  }

  private onShelfDragEnd(shape: Konva.Rect): void {
    const shelf = this.shelfShapeMap.get(shape);
    if (shelf) {
      shelf.x = shape.x();
      shelf.y = shape.y();
      console.log(`${shelf.name} moved to (${shelf.x.toFixed(2)}, ${shelf.y.toFixed(2)})`);
    }
  }

  private debugTest(): void {
    // Inject mock layout for testing
    const mockLayout = this.mockService.generateRetailLayout();
    this.loadLayout(mockLayout);
    console.log('Loaded mock layout:', mockLayout);
    
  }

  private loadLayout(storeLayout: RetailLayout) {
    this.activeRetailLayout = storeLayout;
    this.shelfShapeMap.clear();
    
    this.drawStoreOutline(storeLayout.outline);
    storeLayout.shelves.forEach(shelf => {
      this.drawProductShelf(shelf);
    });
  }

  private drawStoreOutline(outline: { x: number; y: number }[]) {
    const points: number[] = [];
    outline.forEach(point => {
      points.push(point.x, point.y);
    });

    const line = new Konva.Line({
      points: points,
      stroke: 'black',
      strokeWidth: 2,
      closed: true,
    });

    this.layer.add(line);
    this.layer.draw();
  }
}
