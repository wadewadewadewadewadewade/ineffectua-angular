import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';
import { AlertController } from '@ionic/angular';

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

  @ViewChild("body") body: ElementRef;

  constructor(
    private db: AngularFireDatabase,
    public alertController: AlertController,
    private auth: AuthenticationService) {}

  ngOnInit() {
    this.getLocationsList();
  }

  getLocationsList() {
    this.auth.observe((user: firebase.User) => {
      this.locations = this.db
        .list<Location>('/users/' + this.auth.user.uid + '/painlog',
          ref => ref.orderByChild('added')
        )
        .snapshotChanges().pipe(map((mutation: any[]) => mutation.map(p => {
          const loc: Location = p.payload.val();
          loc.key = p.key;
          return loc;
        })));
    });
  }

  stoppedDragging(mark: HTMLElement, location: Location) {
    const match = mark.style.transform.match(/([0-9\.-]+)px,\s*([0-9\.-]+)px/);
    if (match && match.length > 1) {
      location.x = this.numberPairToPercent((((parseFloat(location.x) / 100) * (this.body.nativeElement as HTMLElement).offsetWidth) + parseFloat(match[1])), (this.body.nativeElement as HTMLElement).offsetWidth) + '%';
      location.y = this.numberPairToPercent((((parseFloat(location.y) / 100) * (this.body.nativeElement as HTMLElement).offsetHeight) + parseFloat(match[2])), (this.body.nativeElement as HTMLElement).offsetHeight) + '%';
      mark.style.transform = '';
      this.addLocation(location);
    }
  }

  getNowDateIsoString() {
    const d = new Date(),
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

  getLocation(x: string = null, y: string = null): Location {
    return {
      key: null,
      x,
      y,
      severity: 0,
      label: '',
      added: this.getNowDateIsoString(),
      removed: null,
      description: null
    };
  }

  numberPairToPercent(px: number, dimension: number) {
    return Math.round(((px / dimension)  + Number.EPSILON) * 10000) / 100;
  }

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

  addLocationMouse($event: MouseEvent) {
    this.addLocation(this.getCordinatesMouse($event, null));
  }

  addLocationTouch($event: TouchEvent) {
    this.addLocation(this.getCordinatesTouch($event, null));
  }

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
                loc.removed = this.getNowDateIsoString();
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
