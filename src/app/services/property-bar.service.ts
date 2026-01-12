import { Injectable, signal, computed } from '@angular/core';
import { ProductShelf } from '../domain/models/product-shelf.model';

@Injectable({
  providedIn: 'root'
})
export class PropertyBarService {
  private selectedShelfSignal = signal<ProductShelf | null>(null);
  
  // Read-only computed signal for components to consume
  selectedShelf = this.selectedShelfSignal.asReadonly();
  
  // Computed signal to check if a shelf is selected
  hasSelection = computed(() => this.selectedShelfSignal() !== null);

  selectShelf(shelf: ProductShelf | null): void {
    this.selectedShelfSignal.set(shelf);
  }

  updateShelf(updates: Partial<ProductShelf>): void {
    const current = this.selectedShelfSignal();
    if (current) {
      this.selectedShelfSignal.set({ ...current, ...updates });
    }
  }

  clearSelection(): void {
    this.selectedShelfSignal.set(null);
  }
}
