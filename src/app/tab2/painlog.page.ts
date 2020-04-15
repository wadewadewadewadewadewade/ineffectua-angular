import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseDataService, Location } from '../services/firebasedata.service';
import { AlertController } from '@ionic/angular';

// location detail
import { ModalController } from '@ionic/angular';
import { LocationDetailPage } from './location-detail/location-detail.page';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-painlog',
  templateUrl: 'painlog.page.html',
  styleUrls: ['painlog.page.scss']
})
export class PainLogPage implements OnInit {

  collection = 'painlog';
  public locations: Observable<Location[]>;
  public addedDate = '1970-01-01T00:00:00-07:00';
  public removedDate = this.getDateIsoString();
  private oldest: Date;
  private newest: Date;
  public range = 4;
  public centered = 100;

  @ViewChild('body') body: ElementRef;
  @ViewChild('dateLabel') dateLabel: ElementRef;
  @ViewChild('rangeLabel') rangeLabel: ElementRef;

  constructor(
    private title: Title,
    public alertController: AlertController,
    public db: FirebaseDataService,
    public modalController: ModalController
    ) {
      this.title.setTitle('Pain Log');
    }

  ngOnInit() {
    this.locations = this.db.get<Location>(this.collection, ref => ref.orderByChild('added'));
    this.locations.subscribe(i => {
      i.forEach((o: Location) => {
        this.checkDate(new Date(o.added));
        this.checkDate(new Date(o.removed));
      })
    });
    // it seems that one of these two Elements is consistanly not defined at app-load, so trying a short delay
    setTimeout(() => {
      (this.rangeLabel.nativeElement as HTMLElement).innerHTML = 'all';
      (this.dateLabel.nativeElement as HTMLElement).innerHTML = this.getShortDateString(new Date());
    }, 100)
  }

  /* Tool to get ISO string format for dates and datetimes */
  private getDateIsoString(val?: string | number) {
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

  getShortDateString(d: Date): string {
    const day = d.getDate(),
      month = d.getMonth() + 1;
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

  /* Used by getLocationsList to get the oldest and newset log entry */
  private checkDate(val: Date) {
    if (!this.oldest || val < this.oldest) {
      this.oldest = val;
    }
    if (!this.newest || val > this.newest) {
      this.newest = val;
    }
  }

  updateDate($event: CustomEvent, IsDate: boolean) {
    if (IsDate) {
      this.centered = $event.detail.value as number;
    } else {
      this.range = $event.detail.value as number;
    }
    const centeredDateInMilliseconds = (
        (this.newest.getTime() - this.oldest.getTime()) * (this.centered / 100)
      ) / 2 + this.oldest.getTime(),
      centeredDate = new Date(centeredDateInMilliseconds);
    let rangeLabelText = 'all';
    switch (this.range) {
      case 3: // all dates
      rangeLabelText = 'all';
        this.addedDate = '1970-01-01T00:00:00-07:00';
        this.removedDate = this.getDateIsoString();
        break;
      case 2: // 1 year
      rangeLabelText = '1yr';
        this.addedDate = this.getDateIsoString(centeredDateInMilliseconds - 1.577e+10); // minus 6 months
        this.removedDate = this.getDateIsoString(centeredDateInMilliseconds + 1.577e+10); // plus six months
        break;
      case 1: // 1 week
      rangeLabelText = '1wk';
        this.addedDate = this.getDateIsoString(centeredDateInMilliseconds - 3.024e+8); // minus 3.5 days
        this.removedDate = this.getDateIsoString(centeredDateInMilliseconds + 3.024e+8); // plus 3.5 days
        break;
      case 0: // 1 day
        rangeLabelText = '1d';
        this.addedDate = this.getDateIsoString(centeredDateInMilliseconds - 4.32e+7); // minus 0.5 days
        this.removedDate = this.getDateIsoString(centeredDateInMilliseconds + 4.32e+7); // plus 0.5 days
        break;
    }
    (this.rangeLabel.nativeElement as HTMLElement).innerHTML = rangeLabelText;
    (this.dateLabel.nativeElement as HTMLElement).innerHTML = this.getShortDateString(centeredDate);
    // TODO: I ham having trouble getting the ngFor to reflect this change
    this.locations.subscribe(locations => {
      console.log(locations);
    })
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
      location.x = this.numberPairToPercent(
        (
          (
            (parseFloat(location.x) / 100)* (this.body.nativeElement as HTMLElement).offsetWidth
          ) + parseFloat(match[1])
        ), (this.body.nativeElement as HTMLElement).offsetWidth
      ) + '%';
      location.y = this.numberPairToPercent(
        (
          (
            (parseFloat(location.y) / 100) * (this.body.nativeElement as HTMLElement).offsetHeight
          ) + parseFloat(match[2])
        ), (this.body.nativeElement as HTMLElement).offsetHeight
      ) + '%';
      mark.style.transform = '';
      this.db.put(this.collection, location);
    }
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
    this.db.put(this.collection, this.getCordinatesMouse($event, null));
  }

  /* used to siplify the event handler reference in the html file */
  addLocationTouch($event: TouchEvent) {
    this.db.put(this.collection, this.getCordinatesTouch($event, null));
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
            if (loc.key) {
              loc.removed = this.getDateIsoString();
              this.db.remove(this.collection, loc);
            }
          }
        }
      ]
    });
    await alert.present();
  }

}
