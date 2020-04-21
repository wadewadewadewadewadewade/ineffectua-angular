import { Component, OnInit, ElementRef, ViewChild, Output } from '@angular/core';
import { BehaviorSubject} from 'rxjs';
import { FirebaseDataService, Location } from '../services/firebasedata.service';
import { AlertController } from '@ionic/angular';

// location detail
import { ModalController } from '@ionic/angular';
import { LocationDetailPage } from './location-detail/location-detail.page';
import { Title } from '@angular/platform-browser';
import { EventEmitter } from 'events';

@Component({
  selector: 'app-painlog',
  templateUrl: 'painlog.page.html',
  styleUrls: ['painlog.page.scss']
})
export class PainLogPage implements OnInit {

  collection = 'painlog';
  private locationsBehaviorSubject: BehaviorSubject<Location[]>;
  public locations: Location[] = [];
  private oldest: Date;
  private newest: Date;
  public centered = 100; // later this is devided by 100 to get percentage
  public centeredDate = this.getDateIsoString('1970-01-01T00:00:00-07:00'); // arbitrary initial value

  @ViewChild('body') body: ElementRef;
  @ViewChild('dateLabel') dateLabel: ElementRef;
  @Output() changed = new EventEmitter();

  constructor(
    private title: Title,
    public alertController: AlertController,
    public db: FirebaseDataService,
    public modalController: ModalController
  ) {
    this.title.setTitle('Pain Log');
  }

  ngOnInit() {
    this.db.observe(() => {
      this.locationsBehaviorSubject = this.db.get<Location>(this.collection);
      this.locationsBehaviorSubject.subscribe(i => {
        if (i && i.length > 0) {
          i.forEach((o: Location) => {
            this.checkDate(o.added);
            this.checkDate(o.removed);
          });
          this.locations = i;
          this.centeredDate = this.getShortDateString(new Date(
            (
              (this.newest.getTime() - this.oldest.getTime()) * (this.centered / 100)
            ) + this.oldest.getTime()
          ));
          (this.dateLabel.nativeElement as HTMLElement).innerHTML = this.centeredDate;
        }
      });
    });
  }

  /* Tool to get ISO string format for dates and datetimes */
  private getDateIsoString(val?: string | number | Date) {
    const d = val instanceof Date ? val : val ? new Date(val) : new Date(),
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
    return this.getDateIsoString(d).substr(0, 10);
  }

  /* Used by getLocationsList to get the oldest and newset log entry */
  private checkDate(val: string) {
    if (val) {
      const d = new Date(val);
      if (!this.oldest) {
        this.oldest = d;
      } else if (d < this.oldest) {
        this.oldest = d;
      }
      if (!this.newest) {
        this.newest = d;
      } else if (d > this.newest) {
        this.newest = d;
      }
    }
  }

  locationWithinDateRange(location: Location, centeredDateString: string): boolean {
    const centeredDate = new Date(centeredDateString);
    if (!location.removed && new Date(this.getShortDateString(new Date(location.added))) <= centeredDate) {
      return true;
    } else if (new Date(this.getShortDateString(new Date(location.added))) <= centeredDate) {
      if (location.removed && new Date(this.getShortDateString(new Date(location.removed))) <= centeredDate) {
        return false;
      } else {
        return true;
      }
    }
    return false;
  }

  updateDate($event: CustomEvent, IsDate: boolean) {
    if (IsDate) {
      this.centered = $event.detail.value as number;
    }
    const centeredDateInMilliseconds =
      (
        (this.newest.getTime() - this.oldest.getTime()) * (this.centered / 100)
      ) + this.oldest.getTime();
    this.centeredDate = this.getShortDateString(new Date(centeredDateInMilliseconds));
    (this.dateLabel.nativeElement as HTMLElement).innerHTML = this.centeredDate;
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
