import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';

export interface Location {
  'key': string;
  'x': number;
  'y': number;
  'severity': number;
  'added': string;
  'removed': string;
  'label': string;
}

@Component({
  selector: 'app-painlog',
  templateUrl: 'painlog.page.html',
  styleUrls: ['painlog.page.scss']
})
export class PainLogPage implements OnInit {

  public locations = new Observable<Location[]>();

  constructor(private db: AngularFireDatabase, private auth: AuthenticationService) {}

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

  getCordinates($event: MouseEvent) {
    const loc: Location = {
      key: null,
      x: $event.clientX,
      y: $event.clientY,
      severity: 0,
      label: '',
      added: this.getNowDateIsoString(),
      removed: null
    };
    this.addLocation(loc);
  }

  addLocation(loc?: Location) {
    const user = this.auth.user;
    if (user) {
      if (loc.key) {
        const key = loc.key;
        delete loc.key;
        this.db.object('/users/' + user.uid + '/appointments/' + key).set(loc);
      } else {
        this.db.list('/users/' + user.uid + '/appointments').push(loc);
      }
    }
  }

}
