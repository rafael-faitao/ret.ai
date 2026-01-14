import { ProductShelf } from './product-shelf.model';
import { StructureObject } from './structure-object.model';

export interface Point {
  x: number;
  y: number;
}

export class RetailLayout {
  name: string = '';
  shelves: ProductShelf[] = [];
  structureObjects: StructureObject[] = [];
  outline: Point[] = []; // Array of points defining the store's outer boundary
  backgroundColor: string = '#ffffff';
  overallScore: number = 0; // Global layout performance score
}
