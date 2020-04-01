import { Component } from '@angular/core';
import { AuthenticateService } from '../services/authentication.service';
// import { StorageMap } from '@ngx-pwa/local-storage';
// import { HttpClient } from '@angular/common/http';

// Calendar API credentials
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// import * as credentials from './credentials.json';

export interface Appointment {
  'contact': string;
  'datetime': Date;
  'description': string;
  'location': string;
  'title': string;
}

@Component({
  selector: 'app-calendar',
  templateUrl: 'calendar.page.html',
  styleUrls: ['calendar.page.scss']
})
export class CalendarPage {

  list: Observable<Appointment[]>;

  constructor(private db: AngularFireDatabase, private auth: AuthenticateService) {
    this.list = db.object('/users/' + this.auth.userId$ + '/appointments')
      .valueChanges().pipe(map(o => o as Appointment[]));
  }

}
