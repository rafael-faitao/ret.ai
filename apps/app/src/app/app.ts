import { Component, signal, ViewChild, inject, HostListener } from '@angular/core';
import { EditorComponent } from './components/editor/editor.component';
import { PropertyBarComponent } from './components/property-bar/property-bar.component';
import { PropertyBarService } from './services/property-bar.service';
import { AnalyticsBarComponent } from './components/analytics-bar/analytics-bar.component';
import { LayoutImportDialogComponent } from './components/layout-import-dialog/layout-import-dialog.component';
import { MockService } from './services/mock.service';
import { RetailLayout } from 'models';

@Component({
  selector: 'app-root',
  imports: [EditorComponent, PropertyBarComponent, AnalyticsBarComponent, LayoutImportDialogComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class App {
  @ViewChild('editor') editorComponent?: EditorComponent;
  @ViewChild('importDialog') importDialog?: LayoutImportDialogComponent;

  protected propertyBarService = new PropertyBarService();
  protected mockService = inject(MockService);
  
  protected showMenu = signal(false);

  get hasSelection() {
    return this.propertyBarService.hasSelection();
  }

  toggleMenu(): void {
    this.showMenu.update(value => !value);
  }

  newLayout(): void {
    this.showMenu.set(false);
    const layout = this.mockService.generateRetailLayout();
    this.editorComponent?.loadLayout(layout);
    this.propertyBarService.setActiveLayout(layout);
  }

  openGenerateDialog(): void {
    this.showMenu.set(false);
    this.importDialog?.openDialog();
  }

  onLayoutGenerated(layout: RetailLayout): void {
    this.editorComponent?.loadLayout(layout);
    this.propertyBarService.setActiveLayout(layout);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.menu-button-container')) {
      this.showMenu.set(false);
    }
  }
}
