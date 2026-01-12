import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import Konva from 'konva';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss'
})
export class EditorComponent implements AfterViewInit {
  @ViewChild('konvaContainer', { static: false }) konvaContainer!: ElementRef;
  private stage!: Konva.Stage;
  private layer!: Konva.Layer;

  ngAfterViewInit(): void {
    this.initKonva();
  }

  private initKonva(): void {
    const container = this.konvaContainer.nativeElement;
    const size = Math.min(container.offsetWidth, container.offsetHeight);

    this.stage = new Konva.Stage({
      container: container,
      width: size,
      height: size,
    });

    this.layer = new Konva.Layer();
    this.stage.add(this.layer);
  }
}
