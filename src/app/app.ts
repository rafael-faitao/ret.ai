import { Component } from '@angular/core';
import { EditorComponent } from './components/editor/editor.component';
import { PropertyBarComponent } from './components/property-bar/property-bar.component';
import { PropertyBarService } from './services/property-bar.service';
import { AnalyticsBarComponent } from './components/analytics-bar/analytics-bar.component';

@Component({
  selector: 'app-root',
  imports: [EditorComponent, PropertyBarComponent, AnalyticsBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class App {
  protected propertyBarService = new PropertyBarService();
  
  get hasSelection() {
    return this.propertyBarService.hasSelection();
  }
}
