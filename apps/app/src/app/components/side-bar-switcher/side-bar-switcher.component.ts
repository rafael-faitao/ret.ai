import { Component, Input } from '@angular/core';
import { PropertyBarComponent } from '../property-bar/property-bar.component';
import { PalleteBarComponent } from '../pallete-bar/pallete-bar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-side-bar-switcher',
  standalone: true,
  imports: [PropertyBarComponent, PalleteBarComponent, CommonModule, FormsModule],
  templateUrl: 'side-bar-switcher.component.html',
  styleUrls: ['./side-bar-switcher.component.scss']
})
export class SideBarSwitcherComponent {
  activeTab: 'pallete' | 'property' = 'pallete';
}
