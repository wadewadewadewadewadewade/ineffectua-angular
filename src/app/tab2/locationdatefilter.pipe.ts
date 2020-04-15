import { Location } from './../services/firebasedata.service';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'locationdatefilter'
})
export class LocationdatefilterPipe implements PipeTransform {

  transform(items: Location[], addedString: string, removedString: string): Location[] {
    if (!items) { return new Array<Location>() }
    if (!addedString || ! removedString) { return items }
    const added = new Date(addedString);
    const removed = new Date(removedString);

    return items.filter((item: Location, index: number, locations: Array<Location>) => {
      const response = [];
      items.forEach(it => {
        if (new Date(it.added) >= added) {
          if (!it.removed || new Date(it.removed) > removed) {
            return it;
          }
        }
      });
      return response;
    });
  }

}
