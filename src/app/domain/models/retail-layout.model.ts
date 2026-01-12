import { ProductShelf } from './product-shelf.model';

export interface Point {
  x: number;
  y: number;
}

export class RetailLayout {
  name: string = '';
  shelves: ProductShelf[] = [];
  outline: Point[] = []; // Array of points defining the store's outer boundary
  backgroundColor: string = '#ffffff';
}
