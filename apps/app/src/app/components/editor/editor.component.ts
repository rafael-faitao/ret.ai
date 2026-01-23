import { Component, ElementRef, ViewChild, AfterViewInit, inject, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SideBarSwitcherComponent } from '../side-bar-switcher/side-bar-switcher.component';
import Konva from 'konva';
import { ConfigService } from '../../services/config.service';
import { ProductShelf, StructureObject, RetailLayout } from 'models';
import { MockService } from '../../services/mock.service';
import { PropertyBarService } from '../../services/property-bar.service';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [FormsModule, SideBarSwitcherComponent],
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
  activeRetailLayout: RetailLayout | null = null;
  private shelfShapeMap: Map<Konva.Group, ProductShelf> = new Map();
  private structureObjectShapeMap: Map<Konva.Group, StructureObject> = new Map();
  
  // Scaler properties
  scaleValue: number = 1.0;

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
    alert('a');
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
      x: -shelf.width / 2,
      y: -shelf.height / 2,
      width: shelf.width,
      height: shelf.height,
      fill: shelf.color,
      name: 'shelfRect',
    });

    // Create group to hold rect and text together (no rotation on group)
    const shelfGroup = new Konva.Group({
      x: shelf.x,
      y: shelf.y,
      draggable: true,
    });

    // Add rectangle to group
    shelfGroup.add(rect);

    // Add facing indicator and arrow based on orientation
    const { facingIndicator, arrow } = this.createOrientationIndicators(shelf);
    shelfGroup.add(facingIndicator);
    shelfGroup.add(arrow);

    // Add shelf name text (always horizontal)
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
      name: 'shelfText',
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

  /**
   * Creates the facing indicator and arrow based on shelf orientation.
   * Orientation angles:
   * - 0°: clients access from bottom (arrow points down)
   * - 90°: clients access from right (arrow points right)
   * - 180°: clients access from top (arrow points up)
   * - 270°: clients access from left (arrow points left)
   */
  private createOrientationIndicators(shelf: ProductShelf): { facingIndicator: Konva.Rect; arrow: Konva.Arrow } {
    const indicatorThickness = 6;
    const orientation = shelf.orientation % 360;
    const halfWidth = shelf.width / 2;
    const halfHeight = shelf.height / 2;

    let indicatorConfig: { x: number; y: number; width: number; height: number };
    let arrowPoints: number[];

    switch (orientation) {
      case 90: // Right side access
        indicatorConfig = {
          x: halfWidth,
          y: -halfHeight,
          width: indicatorThickness,
          height: shelf.height,
        };
        arrowPoints = [halfWidth - 15, 0, halfWidth + 5, 0];
        break;
      case 180: // Top side access
        indicatorConfig = {
          x: -halfWidth,
          y: -halfHeight - indicatorThickness,
          width: shelf.width,
          height: indicatorThickness,
        };
        arrowPoints = [0, -halfHeight + 15, 0, -halfHeight - 5];
        break;
      case 270: // Left side access
        indicatorConfig = {
          x: -halfWidth - indicatorThickness,
          y: -halfHeight,
          width: indicatorThickness,
          height: shelf.height,
        };
        arrowPoints = [-halfWidth + 15, 0, -halfWidth - 5, 0];
        break;
      case 0: // Bottom side access (default)
      default:
        indicatorConfig = {
          x: -halfWidth,
          y: halfHeight,
          width: shelf.width,
          height: indicatorThickness,
        };
        arrowPoints = [0, halfHeight - 15, 0, halfHeight + 5];
        break;
    }

    const facingIndicator = new Konva.Rect({
      ...indicatorConfig,
      fill: shelf.color,
      opacity: 0.3,
      name: 'facingIndicator',
    });

    const arrow = new Konva.Arrow({
      points: arrowPoints,
      pointerLength: 8,
      pointerWidth: 6,
      fill: '#ffffff',
      stroke: '#ffffff',
      strokeWidth: 2,
      name: 'orientationArrow',
    });

    return { facingIndicator, arrow };
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
        // Update group position (no rotation on group)
        group.x(shelf.x);
        group.y(shelf.y);

        // Update rectangle color
        const rect = group.findOne('.shelfRect') as Konva.Rect;
        if (rect) {
          rect.fill(shelf.color);
        }

        // Update text
        const text = group.findOne('.shelfText') as Konva.Text;
        if (text) {
          text.text(shelf.name);
        }

        // Remove old orientation indicators and create new ones
        const oldIndicator = group.findOne('.facingIndicator');
        const oldArrow = group.findOne('.orientationArrow');
        if (oldIndicator) oldIndicator.destroy();
        if (oldArrow) oldArrow.destroy();

        const { facingIndicator, arrow } = this.createOrientationIndicators(shelf);
        group.add(facingIndicator);
        group.add(arrow);

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

  public loadLayout(storeLayout: RetailLayout) {
    this.activeRetailLayout = storeLayout;
    this.shelfShapeMap.clear();
    this.structureObjectShapeMap.clear();
    this.propertyBarService.setActiveLayout(storeLayout);
    
    // Clear the layer by removing all children
    this.layer.destroyChildren();
    

    if (storeLayout.outline) {
        this.drawStoreOutline(storeLayout.outline);
    }
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

  /**
   * Scale the entire layout by the specified factor
   */
  scaleLayout(): void {
    if (!this.activeRetailLayout || this.scaleValue <= 0) {
      console.warn('Cannot scale: invalid layout or scale value');
      return;
    }

    const scale = this.scaleValue;

    // Scale shelves
    this.activeRetailLayout.shelves.forEach(shelf => {
      shelf.x *= scale;
      shelf.y *= scale;
      shelf.width *= scale;
      shelf.height *= scale;
    });

    // Scale structure objects
    this.activeRetailLayout.structureObjects.forEach(obj => {
      obj.x *= scale;
      obj.y *= scale;
      obj.width *= scale;
      obj.height *= scale;
    });

    // Scale outline points
    if (this.activeRetailLayout.outline && this.activeRetailLayout.outline.length > 0) {
      this.activeRetailLayout.outline.forEach(point => {
        point.x *= scale;
        point.y *= scale;
      });
    }

    // Reload the layout to redraw everything
    this.loadLayout(this.activeRetailLayout);

    console.log(`Layout scaled by factor: ${scale}`);
    
    // Reset scale value to 1.0 after applying
    this.scaleValue = 1.0;
  }
}
