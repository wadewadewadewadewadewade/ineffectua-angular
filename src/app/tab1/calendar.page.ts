import { Component } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
// import { StorageMap } from '@ngx-pwa/local-storage';
// import { HttpClient } from '@angular/common/http';

// Calendar API credentials
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
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

  public appointments: Observable<Appointment[]>;

  constructor(private db: AngularFireDatabase, private auth: AuthenticationService, public modalController: ModalController) {
    this.auth.observe((user: firebase.User) => {
      this.appointments = this.db.list<Appointment>('/users/' + user.uid + '/appointments').valueChanges();
    }) 
  }

  async addAppointment() {
    const modal = await this.modalController.create({
      component: NewAppointmentPage
    });
    return await modal.present();
  }

}
