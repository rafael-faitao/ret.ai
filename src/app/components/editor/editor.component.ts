import { Component, ElementRef, ViewChild, AfterViewInit, inject, effect } from '@angular/core';
import Konva from 'konva';
import { ConfigService } from '../../services/config.service';
import { ProductShelf } from '../../domain/models/product-shelf.model';
import { StructureObject } from '../../domain/models/structure-object.model';
import { RetailLayout } from '../../domain/models/retail-layout.model';
import { MockService } from '../../services/mock.service';
import { PropertyBarService } from '../../services/property-bar.service';

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
  private propertyBarService = inject(PropertyBarService);
  private activeRetailLayout: RetailLayout | null = null;
  private shelfShapeMap: Map<Konva.Group, ProductShelf> = new Map();
  private structureObjectShapeMap: Map<Konva.Group, StructureObject> = new Map();

  constructor() {
    // Effect to sync property bar changes to Konva shapes
    effect(() => {
      const selectedShelf = this.propertyBarService.selectedShelf();
      console.dir('eff', selectedShelf);
      if (selectedShelf) {
        this.updateShelfVisual(selectedShelf);
      }
    });

    effect(() => {
      const selectedStructureObject = this.propertyBarService.selectedStructureObject();
      if (selectedStructureObject) {
        this.updateStructureObjectVisual(selectedStructureObject);
      }
    });
  }

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

    // Add facing indicator (semi-transparent rectangle at the front)
    const indicatorHeight = 6;
    const facingIndicator = new Konva.Rect({
      x: -shelf.width / 2,
      y: shelf.height / 2,
      width: shelf.width,
      height: indicatorHeight,
      fill: shelf.color,
      opacity: 0.3,
    });
    shelfGroup.add(facingIndicator);

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

    // Add click event for selection
    shelfGroup.on('click', () => this.onShelfSelect(shelf));

    // Add drag event listeners
    shelfGroup.on('dragstart', () => this.onShelfSelect(shelf));
    shelfGroup.on('dragmove', () => this.onShelfDrag(shelfGroup));
    shelfGroup.on('dragend', () => this.onShelfDragEnd(shelfGroup));

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

  private onShelfSelect(shelf: ProductShelf): void {
    this.propertyBarService.selectShelf(shelf);
    console.log('Selected shelf:', shelf.name);
  }

  private updateShelfVisual(shelf: ProductShelf): void {
    // Find the corresponding Konva group by shelf ID
    for (const [group, shelfModel] of this.shelfShapeMap.entries()) {
      if (shelfModel.id === shelf.id) {
        // Update group position and rotation
        group.x(shelf.x);
        group.y(shelf.y);
        group.rotation(shelf.orientation);

        // Update rectangle color
        const rect = group.findOne('Rect') as Konva.Rect;
        if (rect) {
          rect.fill(shelf.color);
        }

        // Update text
        const text = group.findOne('Text') as Konva.Text;
        if (text) {
          text.text(shelf.name);
        }

        this.layer.batchDraw();
        break;
      }
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
    this.structureObjectShapeMap.clear();
    this.propertyBarService.setActiveLayout(storeLayout);
    
    this.drawStoreOutline(storeLayout.outline);
    storeLayout.shelves.forEach(shelf => {
      this.drawProductShelf(shelf);
    });

    storeLayout.structureObjects.forEach(structureObject => {
      this.drawStructureObject(structureObject);
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

  private drawStructureObject(structureObject: StructureObject): void {
    // Create a group for the structure object
    const group = new Konva.Group({
      x: structureObject.x,
      y: structureObject.y,
      rotation: structureObject.orientation,
      draggable: true,
    });

    // Create and add the icon image
    const iconPath = `/assets/ui/${structureObject.type}.svg`;
    const image = new Image();
    image.src = iconPath;
    image.onload = () => {
      const konvaImage = new Konva.Image({
        image: image,
        x: -structureObject.width / 2,
        y: -structureObject.height / 2,
        width: structureObject.width,
        height: structureObject.height,
      });
      group.add(konvaImage);
      this.layer.draw();
    };

    // Add label text below the icon
    const text = new Konva.Text({
      x: -structureObject.width / 2,
      y: structureObject.height / 2 + 5,
      width: structureObject.width,
      text: structureObject.name,
      fontSize: 10,
      fontFamily: 'Arial',
      fill: '#333333',
      align: 'center',
    });

    group.add(text);

    // Track the group-model relationship
    this.structureObjectShapeMap.set(group, structureObject);

    // Add click event for selection
    group.on('click', () => this.onStructureObjectSelect(structureObject));

    // Add drag event listeners
    group.on('dragstart', () => this.onStructureObjectSelect(structureObject));
    group.on('dragmove', () => this.onStructureObjectDrag(group));
    group.on('dragend', () => this.onStructureObjectDragEnd(group));

    this.layer.add(group);
    this.layer.draw();
  }

  private onStructureObjectSelect(structureObject: StructureObject): void {
    this.propertyBarService.selectStructureObject(structureObject);
    console.log('Selected structure object:', structureObject.name, structureObject.type);
  }

  private onStructureObjectDrag(shape: Konva.Group): void {
    const structureObject = this.structureObjectShapeMap.get(shape);
    if (structureObject) {
      structureObject.x = shape.x();
      structureObject.y = shape.y();
    }
  }

  private onStructureObjectDragEnd(shape: Konva.Group): void {
    const structureObject = this.structureObjectShapeMap.get(shape);
    if (structureObject) {
      structureObject.x = shape.x();
      structureObject.y = shape.y();
      console.log(`${structureObject.name} moved to (${structureObject.x.toFixed(2)}, ${structureObject.y.toFixed(2)})`);
    }
  }
private updateStructureObjectVisual(structureObject: StructureObject): void {
    // Find the corresponding Konva group by structure object ID
    for (const [group, objectModel] of this.structureObjectShapeMap.entries()) {
      if (objectModel.id === structureObject.id) {
        // Update group position and rotation
        group.x(structureObject.x);
        group.y(structureObject.y);
        group.rotation(structureObject.orientation);

        // Update text
        const text = group.findOne('Text') as Konva.Text;
        if (text) {
          text.text(structureObject.name);
        }

        // Update icon if type changed
        const existingImage = group.findOne('Image') as Konva.Image;
        if (existingImage) {
          const iconPath = `/assets/ui/${structureObject.type}.svg`;
          const image = new Image();
          image.src = iconPath;
          image.onload = () => {
            existingImage.image(image);
            this.layer.batchDraw();
          };
        }

        this.layer.batchDraw();
        break;
      }
    }
  }

  
  
}
