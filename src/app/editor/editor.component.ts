import { Component, ElementRef, ViewChild, AfterViewInit, inject, OnDestroy } from '@angular/core';
import Konva from 'konva';
import { ConfigService } from '../services/config.service';
import { ProductShelf } from '../domain/models/product-shelf.model';
import { RetailLayout } from '../domain/models/retail-layout.model';
import { MockService } from '../services/mock.service';
import { fromEvent, Subject, debounceTime, takeUntil } from 'rxjs';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss'
})
export class EditorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('konvaContainer', { static: false }) konvaContainer!: ElementRef;
  private stage!: Konva.Stage;
  private layer!: Konva.Layer;
  private bgLayer!: Konva.Layer;

  private gridSize: number = 20;
  private configService = inject(ConfigService);
  private mockService = inject(MockService);
  private activeRetailLayout: RetailLayout | null = null;
  private shelfShapeMap: Map<Konva.Group, ProductShelf> = new Map();
  private destroy$ = new Subject<void>();

  ngAfterViewInit(): void {
    this.initKonva();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
    // Create shelf rectangle
    const rect = new Konva.Rect({
      x: 0,
      y: 0,
      width: shelf.width,
      height: shelf.height,
      fill: shelf.color,
      offsetX: shelf.width / 2,
      offsetY: shelf.height / 2,
    });

    // Create group to hold rect and text together
    const shelfGroup = new Konva.Group({
      x: shelf.x,
      y: shelf.y,
      rotation: shelf.orientation,
      draggable: true,
    });

    // Add rectangle to group
    shelfGroup.add(rect);

    // Add shelf name text
    const text = new Konva.Text({
      x: -shelf.width / 2,
      y: -shelf.height / 2,
      width: shelf.width,
      height: shelf.height,
      text: shelf.name,
      fontSize: 12,
      fontFamily: 'Arial',
      fill: '#ffffff',
      align: 'center',
      verticalAlign: 'middle',
      padding: 5,
    });

    shelfGroup.add(text);

    // Track the group-model relationship
    this.shelfShapeMap.set(shelfGroup, shelf);

    // Use RxJS for drag event handling
    fromEvent(shelfGroup, 'dragmove')
      .pipe(
        debounceTime(10),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.onShelfDrag(shelfGroup));

    fromEvent(shelfGroup, 'dragend')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.onShelfDragEnd(shelfGroup));

    this.layer.add(shelfGroup);
    this.layer.draw();
  }

  private onShelfDrag(shape: Konva.Group): void {
    const shelf = this.shelfShapeMap.get(shape);
    if (shelf) {
      shelf.x = shape.x();
      shelf.y = shape.y();
    }
  }

  private onShelfDragEnd(shape: Konva.Group): void {
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
