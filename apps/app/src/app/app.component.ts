import { Component, HostListener, inject, signal, ViewChild } from '@angular/core';
import { AnalyticsBarComponent } from './components/analytics-bar/analytics-bar.component';
import { EditorComponent } from './components/editor/editor.component';
import { LayoutImportDialogComponent } from './components/layout-import-dialog/layout-import-dialog.component';
import { SideBarSwitcherComponent } from './components/side-bar-switcher/side-bar-switcher.component';
import { RetailLayout } from 'models';
import { MockService } from './services/mock.service';
import { PropertyBarService } from './services/property-bar.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SideBarSwitcherComponent, AnalyticsBarComponent, EditorComponent, LayoutImportDialogComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
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
