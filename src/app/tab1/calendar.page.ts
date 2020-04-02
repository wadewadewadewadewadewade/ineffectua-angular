import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

// Calendar API credentials
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';

// new appointment
import { ModalController } from '@ionic/angular';
import { NewAppointmentPage } from './new-appointment/new-appointment.page';

export interface Appointment {
  'key': string;
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
export class CalendarPage implements OnInit {

  public appointments = new Observable<Appointment[]>();

  constructor(private db: AngularFireDatabase, private auth: AuthenticationService, public modalController: ModalController) {}

  ngOnInit() {
    this.auth.observe((user: firebase.User) => {
      this.appointments = this.db
        .list<Appointment>('/users/' + this.auth.user.uid + '/appointments', ref => ref.orderByChild('datetime'))
        .valueChanges();
    });
  }

  async addAppointment() {
    const modal = await this.modalController.create({
      component: NewAppointmentPage
    });
    return await modal.present();
  }

  parseDate(dateString: string): string {
    return new Date(dateString).toLocaleString().replace(', ', '<br/>');
  }

}
