import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { RetailLayout } from 'models';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class AILayoutImportService {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);
  private apiUrl = 'http://localhost:3000/api';

  /**
   * Generate a RetailLayout from text description using the backend API.
   */
  async textToLayout(description: string): Promise<RetailLayout> {
    try {
      return await firstValueFrom(
        this.http.post<RetailLayout>(
          `${this.apiUrl}/retail-layout/generate-from-text`,
          { description }
        )
      );
    } catch (error) {
      console.error('Error generating layout from text:', error);
      throw error;
    }
  }

  /**
   * Generate a RetailLayout from an image file using the backend API.
   */
  async imageToLayout(file: File): Promise<RetailLayout> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      return await firstValueFrom(
        this.http.post<RetailLayout>(
          `${this.apiUrl}/retail-layout/generate-from-image`,
          formData
        )
      );
    } catch (error) {
      console.error('Error generating layout from image:', error);
      throw error;
    }
  }
}
