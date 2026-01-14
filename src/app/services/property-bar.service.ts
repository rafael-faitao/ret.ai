import { Injectable, signal, computed } from '@angular/core';
import { ProductShelf } from '../domain/models/product-shelf.model';
import { StructureObject } from '../domain/models/structure-object.model';
import { RetailLayout } from '../domain/models/retail-layout.model';

@Injectable({
  providedIn: 'root'
})
export class PropertyBarService {
  private selectedShelfSignal = signal<ProductShelf | null>(null);
  private selectedStructureObjectSignal = signal<StructureObject | null>(null);
  private activeLayoutSignal = signal<RetailLayout | null>(null);
  
  // Read-only computed signals for components to consume
  selectedShelf = this.selectedShelfSignal.asReadonly();
  selectedStructureObject = this.selectedStructureObjectSignal.asReadonly();
  activeLayout = this.activeLayoutSignal.asReadonly();
  
  // Computed signal to check if anything is selected
  hasSelection = computed(() => this.selectedShelfSignal() !== null || this.selectedStructureObjectSignal() !== null);

  selectShelf(shelf: ProductShelf | null): void {
    this.selectedShelfSignal.set(shelf);
    this.selectedStructureObjectSignal.set(null);
  }

  selectStructureObject(structureObject: StructureObject | null): void {
    this.selectedStructureObjectSignal.set(structureObject);
    this.selectedShelfSignal.set(null);
  }

  updateShelf(updates: Partial<ProductShelf>): void {
    const current = this.selectedShelfSignal();
    if (current) {
      this.selectedShelfSignal.set({ ...current, ...updates });
    }
  }

  updateStructureObject(updates: Partial<StructureObject>): void {
    const current = this.selectedStructureObjectSignal();
    if (current) {
      this.selectedStructureObjectSignal.set({ ...current, ...updates });
    }
  }

  clearSelection(): void {
    this.selectedShelfSignal.set(null);
    this.selectedStructureObjectSignal.set(null);
  }

  setActiveLayout(layout: RetailLayout | null): void {
    this.activeLayoutSignal.set(layout);
  }
}
