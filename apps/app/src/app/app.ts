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


  
}
