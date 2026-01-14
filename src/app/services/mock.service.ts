import { Injectable } from '@angular/core';
import { RetailLayout, Point } from '../domain/models/retail-layout.model';
import { ProductShelf } from '../domain/models/product-shelf.model';
import { StructureObject, StructureObjectType } from '../domain/models/structure-object.model';

@Injectable({
  providedIn: 'root'
})
export class MockService {

  generateRetailLayout(): RetailLayout {
    const layout = new RetailLayout();
    layout.name = 'Sample Store Layout';
    layout.shelves = this.generateShelves(8);
    layout.structureObjects = this.generateStructureObjects();
    layout.outline = this.generateStoreOutline();
    layout.backgroundColor = '#ffffff';
    return layout;
  }

  generateShelves(count: number = 5): ProductShelf[] {
    const shelves: ProductShelf[] = [];
    const colors = ['#597DA9', '#E85D75', '#59A96D', '#E8A75D', '#9D59A9'];
    
    for (let i = 0; i < count; i++) {
      const shelf = new ProductShelf();
      shelf.name = `Shelf ${i + 1}`;
      shelf.x = 100 + (i % 3) * 150;
      shelf.y = 100 + Math.floor(i / 3) * 120;
      shelf.width = 100;
      shelf.height = 50;
      shelf.orientation = (i % 2) * 90; // Alternate between 0 and 90 degrees
      shelf.color = colors[i % colors.length];
      shelves.push(shelf);
    }
    
    return shelves;
  }

  generateStoreOutline(width: number = 800, height: number = 600): Point[] {
    // Generate an L-shaped store outline
    const w = width;
    const h = height;
    return [
      { x: 0, y: 0 },
      { x: w * 0.6, y: 0 },
      { x: w * 0.6, y: h * 0.4 },
      { x: w, y: h * 0.4 },
      { x: w, y: h },
      { x: 0, y: h }
    ];
  }

  generateCustomOutline(points: Point[]): Point[] {
    return [...points];
  }

  generateStructureObjects(): StructureObject[] {
    const objects: StructureObject[] = [];

    // Entrance at the bottom center
    const entrance = new StructureObject();
    entrance.name = 'Main Entrance';
    entrance.type = StructureObjectType.ENTRANCE;
    entrance.x = 350;
    entrance.y = 550;
    entrance.width = 80;
    entrance.height = 40;
    entrance.orientation = 0;
    objects.push(entrance);

    // Exit at the upper right
    const exit = new StructureObject();
    exit.name = 'Exit';
    exit.type = StructureObjectType.EXIT;
    exit.x = 700;
    exit.y = 30;
    exit.width = 80;
    exit.height = 40;
    exit.orientation = 0;
    objects.push(exit);

    // Entrance/Exit combined
    const entranceExit = new StructureObject();
    entranceExit.name = 'Side Entrance/Exit';
    entranceExit.type = StructureObjectType.ENTRANCE_EXIT;
    entranceExit.x = 20;
    entranceExit.y = 300;
    entranceExit.width = 40;
    entranceExit.height = 80;
    entranceExit.orientation = 90;
    objects.push(entranceExit);

    // Cash counter next to exit (Brazilian supermarket style)
    const cashCounter1 = new StructureObject();
    cashCounter1.name = 'Cash Counter 1';
    cashCounter1.type = StructureObjectType.CASH_COUNTER;
    cashCounter1.x = 650;
    cashCounter1.y = 80;
    cashCounter1.width = 120;
    cashCounter1.height = 40;
    cashCounter1.orientation = 0;
    objects.push(cashCounter1);

    // Additional cash counter near main entrance
    const cashCounter2 = new StructureObject();
    cashCounter2.name = 'Cash Counter 2';
    cashCounter2.type = StructureObjectType.CASH_COUNTER;
    cashCounter2.x = 300;
    cashCounter2.y = 480;
    cashCounter2.width = 120;
    cashCounter2.height = 40;
    cashCounter2.orientation = 0;
    objects.push(cashCounter2);

    // Structural blockers in the middle (avoiding shelf positions)
    // Shelves are at x: ~100, 250, 400 and y: ~100, 220, 340
    
    const blocker1 = new StructureObject();
    blocker1.name = 'Structural Blocker 1';
    blocker1.type = StructureObjectType.STRUCTURAL_BLOCKER;
    blocker1.x = 520;
    blocker1.y = 380;
    blocker1.width = 60;
    blocker1.height = 100;
    blocker1.orientation = 0;
    objects.push(blocker1);

    const blocker2 = new StructureObject();
    blocker2.name = 'Structural Blocker 2';
    blocker2.type = StructureObjectType.STRUCTURAL_BLOCKER;
    blocker2.x = 600;
    blocker2.y = 280;
    blocker2.width = 80;
    blocker2.height = 60;
    blocker2.orientation = 45;
    objects.push(blocker2);

    const blocker3 = new StructureObject();
    blocker3.name = 'Structural Blocker 3';
    blocker3.type = StructureObjectType.STRUCTURAL_BLOCKER;
    blocker3.x = 450;
    blocker3.y = 200;
    blocker3.width = 50;
    blocker3.height = 80;
    blocker3.orientation = 0;
    objects.push(blocker3);

    return objects;
  
  }
}
