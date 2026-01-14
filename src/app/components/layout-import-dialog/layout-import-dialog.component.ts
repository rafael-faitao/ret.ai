import { Component, inject, signal, ChangeDetectionStrategy, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RetailLayout } from '../../domain/models/retail-layout.model';
import { AILayoutImportService } from '../../services/ai-layout-import.service';

@Component({
  selector: 'app-layout-import-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './layout-import-dialog.component.html',
  styleUrl: './layout-import-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutImportDialogComponent {
  private aiService = inject(AILayoutImportService);

  protected isOpen = signal(false);
  protected importMode = signal<'text' | 'image' | null>(null);
  protected textDescription = signal('');
  protected isGenerating = signal(false);
  protected result = signal<RetailLayout | null>(null);

  onLayoutGenerated = output<RetailLayout>();

  openDialog(): void {
    this.isOpen.set(true);
    this.importMode.set(null);
    this.textDescription.set('');
    this.isGenerating.set(false);
    this.result.set(null);
  }

  closeDialog(): void {
    this.isOpen.set(false);
  }

  selectMode(mode: 'text' | 'image' | null): void {
    this.importMode.set(mode);
  }

  async generateFromText(): Promise<void> {
    const desc = this.textDescription().trim();
    if (!desc) return;

    this.isGenerating.set(true);
    try {
      const layout = await this.aiService.textToLayout(desc);
      this.result.set(layout);
      this.onLayoutGenerated.emit(layout);
      this.closeDialog();
    } finally {
      this.isGenerating.set(false);
    }
  }

  async handleImageSelect(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.isGenerating.set(true);
    try {
      const layout = await this.aiService.imageToLayout(file);
      this.result.set(layout);
      this.onLayoutGenerated.emit(layout);
      this.closeDialog();
    } finally {
      this.isGenerating.set(false);
    }
  }
}
