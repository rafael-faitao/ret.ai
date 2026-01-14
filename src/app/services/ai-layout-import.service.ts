import { Injectable } from '@angular/core';
import { RetailLayout } from '../domain/models/retail-layout.model';
import { MockService } from './mock.service';

@Injectable({
  providedIn: 'root'
})
export class AILayoutImportService {
  constructor(private mockService: MockService) {}

  /**
   * Generate a RetailLayout from text description.
   * Currently returns a mocked layout with simulated delay.
   */
  async textToLayout(description: string): Promise<RetailLayout> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    // For now, return the mock layout
    return this.mockService.generateRetailLayout();
  }

  /**
   * Generate a RetailLayout from an image file.
   * Currently returns a mocked layout with simulated delay.
   */
  async imageToLayout(file: File): Promise<RetailLayout> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    // For now, return the mock layout
    return this.mockService.generateRetailLayout();
  }
}
