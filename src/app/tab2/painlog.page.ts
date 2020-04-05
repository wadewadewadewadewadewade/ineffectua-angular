import { Component, OnInit, ElementRef, ViewChild, HostListener, Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { map, filter } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';
import { AlertController } from '@ionic/angular';

// location detail
import { ModalController } from '@ionic/angular';
import { LocationDetailPage } from './location-detail/location-detail.page';
import { Event } from '@angular/router';
import { RangeChangeEventDetail, RangeValue } from '@ionic/core';
import { isDate } from 'util';

export interface Location {
  'key': string;
  'x': string;
  'y': string;
  'severity': number;
  'added': string;
  'removed': string;
  'label': string;
  'description': string;
}

@Component({
  selector: 'app-painlog',
  templateUrl: 'painlog.page.html',
  styleUrls: ['painlog.page.scss']
})
export class PainLogPage implements OnInit {

  public locations = new Observable<Location[]>();
  private addedDate = '1970-01-01T00:00:00-07:00';
  private removedDate = this.getDateIsoString();
  private oldest: Date;
  private newest: Date;
  public range = 4;
  public centered = 1;
  public rangeLabel = 'all';
  public dateLabel = this.getShortDateString(new Date());

  @ViewChild('body') body: ElementRef;

  constructor(
    private db: AngularFireDatabase,
    public alertController: AlertController,
    private auth: AuthenticationService,
    public modalController: ModalController
    ) {}

  ngOnInit() {
    this.getLocationsList();
  }

  getShortDateString(d: Date): string {
    const day = d.getDay(),
      month = d.getMonth();
    let dayString: string, monthString: string;
    if (day < 10) {
      dayString = '0' + day;
    } else {
      dayString = '' + day;
    }
    if (month < 10) {
      monthString = '0' + month;
    } else {
      monthString = '' + month;
    }
    return d.getFullYear() + '-' + monthString + '-' + dayString;
  }

  updateDate($event: RangeChangeEventDetail, IsDate: boolean) {
    const centeredDateInMilliseconds = ((this.newest.getTime() - this.oldest.getTime()) * this.centered) / 2 + this.oldest.getTime(),
      centeredDate = new Date(centeredDateInMilliseconds);
    this.dateLabel = this.getShortDateString(centeredDate);
    console.log($event, IsDate);
    switch (this.range) {
      case 3: // all dates
        this.rangeLabel = 'all';
        this.addedDate = '1970-01-01T00:00:00-07:00';
        this.removedDate = this.getDateIsoString();
        break;
      case 2: // 1 year
        this.rangeLabel = '1yr';
        this.addedDate = this.getDateIsoString(centeredDateInMilliseconds - 1.577e+10); // minus 6 months
        this.removedDate = this.getDateIsoString(centeredDateInMilliseconds + 1.577e+10); // plus six months
        break;
      case 1: // 1 week
        this.rangeLabel = '1wk';
        this.addedDate = this.getDateIsoString(centeredDateInMilliseconds - 3.024e+8); // minus 3.5 days
        this.removedDate = this.getDateIsoString(centeredDateInMilliseconds + 3.024e+8); // plus 3.5 days
        break;
      case 0: // 1 day
        this.rangeLabel = '1d';
        this.addedDate = this.getDateIsoString(centeredDateInMilliseconds - 4.32e+7); // minus 0.5 days
        this.removedDate = this.getDateIsoString(centeredDateInMilliseconds + 4.32e+7); // plus 0.5 days
        break;
    }
    this.getLocationsList();
  }

  /* Used by getLocationsList to get the oldest and newset log entry */
  checkDate(val: Date) {
    if (!this.oldest || val < this.oldest) {
      this.oldest = val;
    }
    if (!this.newest || val > this.newest) {
      this.newest = val;
    }
  }

  /* Dig up and serialize into Location objects log entries */
  getLocationsList() {
    const added = new Date(this.addedDate),
      removed = new Date(this.removedDate);
    this.auth.observe((user: firebase.User) => {
      this.locations = this.db
        .list<Location>('/users/' + this.auth.user.uid + '/painlog',
          ref => ref.orderByChild('added')
        )
        .snapshotChanges().pipe(map((mutation: any[]) => mutation.map(p => {
          const loc: Location = p.payload.val();
          loc.key = p.key;
          return loc;
        }).filter((loc: Location) => {
            const locationAdded = new Date(loc.added),
              locationRemoved = new Date(loc.removed);
            let ret = true;
            this.checkDate(locationAdded);
            this.checkDate(locationRemoved);
            if (!loc.added || locationAdded < added) {
              ret = false;
            }
            if (loc.removed && locationRemoved < removed) {
              ret = false;
            }
            return ret;
        })));
    });
  }

  /* Used to swap the display of th elog entry when it gets too close to the right edge of the screen, so it's buttons are still usable */
  getDir(val: string) {
    if (parseFloat(val) > 65) {
      return 'rtl';
    } else {
      return 'ltr';
    }
  }

  /* Used to swap the display of th elog entry when it gets too close to the right edge of the screen, so it's buttons are still usable */
  getFlip(val: string) {
    return parseFloat(val) > 65;
  }

  /* Event that fires when dragging ends, so we can write the new location back into the DB and prep for further dragging */
  stoppedDragging(mark: HTMLElement, location: Location) {
    const match = mark.style.transform.match(/([0-9\.-]+)px,\s*([0-9\.-]+)px/);
    if (match && match.length > 1) {
      location.x = this.numberPairToPercent((((parseFloat(location.x) / 100) * (this.body.nativeElement as HTMLElement).offsetWidth) + parseFloat(match[1])), (this.body.nativeElement as HTMLElement).offsetWidth) + '%';
      location.y = this.numberPairToPercent((((parseFloat(location.y) / 100) * (this.body.nativeElement as HTMLElement).offsetHeight) + parseFloat(match[2])), (this.body.nativeElement as HTMLElement).offsetHeight) + '%';
      mark.style.transform = '';
      this.addLocation(location);
    }
  }

  /* Tool to get ISO string format for dates and datetimes */
  getDateIsoString(val?: string | number) {
    const d = val ? new Date(val) : new Date(),
      tzo = -d.getTimezoneOffset(),
      dif = tzo >= 0 ? '+' : '-',
      pad = (num: number) => {
          const norm = Math.floor(Math.abs(num));
          return (norm < 10 ? '0' : '') + norm;
      };
    return d.getFullYear() +
      '-' + pad(d.getMonth() + 1) +
      '-' + pad(d.getDate()) +
      'T' + pad(d.getHours()) +
      ':' + pad(d.getMinutes()) +
      ':' + pad(d.getSeconds()) +
      dif + pad(tzo / 60) +
      ':' + pad(tzo % 60);
  }

  /* initialize a Location object (I suppose I should make Location a class with a constructor...) */
  getLocation(x: string = null, y: string = null): Location {
    return {
      key: null,
      x,
      y,
      severity: 0,
      label: '',
      added: this.getDateIsoString(),
      removed: null,
      description: null
    };
  }

  /* Rounding tool to get percent from px value */
  numberPairToPercent(px: number, dimension: number) {
    return Math.round(((px / dimension)  + Number.EPSILON) * 10000) / 100;
  }

  /* used when creating new log entries, by clicking on the figure */
  getCordinatesMouse($event: MouseEvent, markMatch: Array<any>): Location {
    const target = $event.target as HTMLElement,
      isMark = markMatch && markMatch.length > 1,
      xAsPx = isMark ? $event.clientX - markMatch[1] : $event.clientX,
      yAsPx = isMark ? $event.clientY - markMatch[2] : $event.clientY,
      xAsPercent = this.numberPairToPercent(xAsPx, (this.body.nativeElement as HTMLElement).offsetWidth),
      yAsPercent = this.numberPairToPercent(yAsPx, (this.body.nativeElement as HTMLElement).offsetHeight),
      loc = this.getLocation(xAsPercent + '%', yAsPercent + '%');
    return loc;
  }

  /* used when creating new log entries, by tapping on the figure */
  getCordinatesTouch($event: TouchEvent, markMatch: Array<any>): Location {
    const target = $event.target as HTMLElement,
      isMark = markMatch && markMatch.length > 1,
      xAsPx = isMark ? $event.targetTouches[0].clientX - markMatch[1] : $event.targetTouches[0].clientX,
      yAsPx = isMark ? $event.targetTouches[0].clientY - markMatch[2] : $event.targetTouches[0].clientY,
      xAsPercent = Math.round(((xAsPx / (this.body.nativeElement as HTMLElement).offsetWidth)  + Number.EPSILON) * 10000) / 100,
      yAsPercent = Math.round(((yAsPx / (this.body.nativeElement as HTMLElement).offsetHeight)  + Number.EPSILON) * 10000) / 100,
      loc = this.getLocation(xAsPercent + '%', yAsPercent + '%');
    return loc;
  }

  /* used to siplify the event handler reference in the html file */
  addLocationMouse($event: MouseEvent) {
    this.addLocation(this.getCordinatesMouse($event, null));
  }

  /* used to siplify the event handler reference in the html file */
  addLocationTouch($event: TouchEvent) {
    this.addLocation(this.getCordinatesTouch($event, null));
  }

  /* General toold for inserting new or updating existing log entrties */
  addLocation(loc: Location) {
    const user = this.auth.user;
    if (user) {
      if (loc && loc.key) {
        const key = loc.key;
        delete loc.key;
        this.db.object('/users/' + user.uid + '/painlog/' + key).set(loc);
      } else {
        this.db.list('/users/' + user.uid + '/painlog').push(loc);
      }
    }
  }

  /* launch the deail modal */
  async infoLocation(loc: Location) {
    const modal = await this.modalController.create({
      component: LocationDetailPage,
      componentProps: { location: loc }
    });
    return await modal.present();
  }

  async deleteLocation(loc: Location) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure you would like to delete this location?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            // console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Delete',
          handler: () => {
            const user = this.auth.user;
            if (user) {
              if (loc.key) {
                loc.removed = this.getDateIsoString();
                this.addLocation(loc);
              }
            }
          }
        }
      ]
    });
    await alert.present();
  }

}
