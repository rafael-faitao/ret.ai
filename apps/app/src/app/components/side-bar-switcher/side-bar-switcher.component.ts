import { Component, Input } from '@angular/core';
import { PropertyBarComponent } from '../property-bar/property-bar.component';
import { PalleteBarComponent } from '../pallete-bar/pallete-bar.component';


@Component({
  selector: 'app-side-bar-switcher',
  standalone: true,
  imports: [PropertyBarComponent, PalleteBarComponent],
  template: `
    <div class="sidebar-switcher">
      <div class="switcher-tabs">
        <button (click)="activeTab = 'pallete'" [class.active]="activeTab === 'pallete'">Pallete</button>
        <button (click)="activeTab = 'property'" [class.active]="activeTab === 'property'">Properties</button>
      </div>
      <div class="switcher-content">
        <app-pallete-bar *ngIf="activeTab === 'pallete'"></app-pallete-bar>
        <app-property-bar *ngIf="activeTab === 'property'"></app-property-bar>
      </div>
    </div>
  `,
  styleUrls: ['./side-bar-switcher.component.scss']
})
export class SideBarSwitcherComponent {
  activeTab: 'pallete' | 'property' = 'pallete';
}
