import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { PropertyBarService } from '../../services/property-bar.service';
import { StructureObjectType } from '../../domain/models/structure-object.model';

@Component({
  selector: 'app-property-bar',
  standalone: true,
  imports: [],
  templateUrl: './property-bar.component.html',
  styleUrl: './property-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyBarComponent {
  private propertyBarService = inject(PropertyBarService);
  
  protected shelf = this.propertyBarService.selectedShelf;
  protected structureObject = this.propertyBarService.selectedStructureObject;
  protected StructureObjectType = StructureObjectType;

  onNameChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.propertyBarService.updateShelf({ name: input.value });
  }

  onColorChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.propertyBarService.updateShelf({ color: input.value });
  }

  onOrientationChange(orientation: number): void {
    this.propertyBarService.updateShelf({ orientation });
  }

  onDelete(): void {
    // TODO: Implement delete functionality
    console.log('Delete shelf');
    this.propertyBarService.clearSelection();
  }

  // Structure Object methods
  onStructureObjectNameChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.propertyBarService.updateStructureObject({ name: input.value });
  }

  onStructureObjectTypeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.propertyBarService.updateStructureObject({ type: select.value as StructureObjectType });
  }

  onStructureObjectOrientationChange(orientation: number): void {
    this.propertyBarService.updateStructureObject({ orientation });
  }

  onStructureObjectDelete(): void {
    // TODO: Implement delete functionality
    console.log('Delete structure object');
    this.propertyBarService.clearSelection();
  }
}
