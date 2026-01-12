import { Injectable } from '@angular/core';
import { RetailLayout, Point } from '../domain/models/retail-layout.model';
import { ProductShelf } from '../domain/models/product-shelf.model';

@Injectable({
  providedIn: 'root'
})
export class MockService {

  generateRetailLayout(): RetailLayout {
    const layout = new RetailLayout();
    layout.name = 'Sample Store Layout';
    layout.shelves = this.generateShelves(8);
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
    // Generate a simple rectangular outline
    return [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: width, y: height },
      { x: 0, y: height }
    ];
  }

  generateCustomOutline(points: Point[]): Point[] {
    return [...points];
  }
}
