import { Component, OnInit, HostListener, Directive } from '@angular/core';
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

  mouseup($event: MouseEvent, loc: Location) {
    const temp = this.getCordinates($event, true);
    loc.x = temp.x;
    loc.y = temp.y;
    console.log(loc, $event);
    // this.addLocation(loc);
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

  getCordinates($event: MouseEvent, isMark: boolean): Location {
    const body = $event.target as HTMLElement,
      container = isMark ? body.parentElement.parentElement.parentElement : body.parentElement.parentElement,
      containerWidth = container.offsetWidth,
      containerHeight = container.offsetHeight,
      xAsPercent = Math.round((($event.clientX / containerWidth)  + Number.EPSILON) * 10000) / 100,
      yAsPercent = Math.round((($event.clientY / containerHeight)  + Number.EPSILON) * 10000) / 100,
      loc = this.getLocation(xAsPercent + '%', yAsPercent + '%');
    return loc;
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
