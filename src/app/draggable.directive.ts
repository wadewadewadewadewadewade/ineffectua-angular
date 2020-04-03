import { Directive, HostListener, Input, ElementRef } from '@angular/core';
import { Location } from './tab2/painlog.page';

@Directive({
  selector: '[draggable]'
})
export class DraggableDirective {

  constructor() {
    this.element.getSelection().removeAllRanges(); // doesn't work yet
  }

  @Input() location: Location;
  @Input() element: ElementRef;

  @HostListener('click', ['$event'])
  click(event: MouseEvent) {
    console.log('click', event);
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('mousemove', ['$event'])
  mousemove(event: MouseEvent) {
    console.log('mousemove', event);
  }

  @HostListener('mousedown', ['$event'])
  mousedown(event: MouseEvent) {
    console.log('mousedown', event);
  }

  @HostListener('mouseup', ['$event'])
  mouseup(event: MouseEvent) {
    console.log('mouseup', event);
    this.getCordinates(event);
    console.log(this.location);
  }

  getCordinates($event: MouseEvent) {
    const obj = $event.target as HTMLElement,
      container = obj.parentElement.parentElement,
      containerWidth = container.offsetWidth,
      containerHeight = container.offsetHeight,
      xAsPercent = Math.round((($event.clientX / containerWidth)  + Number.EPSILON) * 10000) / 100,
      yAsPercent = Math.round((($event.clientY / containerHeight)  + Number.EPSILON) * 10000) / 100,
      x = xAsPercent + '%',
      y = yAsPercent + '%';
    this.location.x = x;
    this.location.y = y;
  }

}
