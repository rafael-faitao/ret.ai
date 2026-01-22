import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pallete-bar',
  standalone: true,
  template: `
    <div class="pallete-bar">
      <h3>Add Element</h3>
      <div class="pallete-items">
        <button (click)="add.emit({ type: 'shelf' })">Add Shelf</button>
        <button (click)="add.emit({ type: 'structure', structureType: 'entrance' })">Add Entrance</button>
        <button (click)="add.emit({ type: 'structure', structureType: 'exit' })">Add Exit</button>
        <button (click)="add.emit({ type: 'structure', structureType: 'cash_counter' })">Add Cash Counter</button>
        <button (click)="add.emit({ type: 'structure', structureType: 'blocker' })">Add Blocker</button>
      </div>
    </div>
  `,
  styleUrls: ['./pallete-bar.component.scss']
})
export class PalleteBarComponent {
  @Output() add = new EventEmitter<any>();
}
