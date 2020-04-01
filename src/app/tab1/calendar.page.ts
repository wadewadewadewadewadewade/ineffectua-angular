import { Component } from '@angular/core';
import { AuthenticateService } from '../services/authentication.service';
// import { StorageMap } from '@ngx-pwa/local-storage';
// import { HttpClient } from '@angular/common/http';

// Calendar API credentials
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// new appointment
import { ModalController } from '@ionic/angular';
import { NewAppointmentPage } from './new-appointment/new-appointment.page';

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

  constructor(private db: AngularFireDatabase, private auth: AuthenticateService, public modalController: ModalController) {
    const user = this.auth.user;
    if (user) {
      this.list = db.object('/users/' + user.providerData[0].uid + '/appointments')
        .valueChanges().pipe(map(o => o as Appointment[]));
    }
  }

  async addAppointment() {
    const modal = await this.modalController.create({
      component: NewAppointmentPage
    });
    return await modal.present();
  }

}
