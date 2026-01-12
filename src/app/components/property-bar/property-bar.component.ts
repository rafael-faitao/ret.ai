import { Component, inject } from '@angular/core';
import { PropertyBarService } from '../../services/property-bar.service';

@Component({
  selector: 'app-property-bar',
  standalone: true,
  imports: [],
  templateUrl: './property-bar.component.html',
  styleUrl: './property-bar.component.scss'
})
export class PropertyBarComponent {
  private propertyBarService = inject(PropertyBarService);
  
  protected shelf = this.propertyBarService.selectedShelf;

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
}
