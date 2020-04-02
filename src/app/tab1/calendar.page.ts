import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

// Calendar API credentials
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';

// new appointment
import { ModalController } from '@ionic/angular';
import { NewAppointmentPage } from './new-appointment/new-appointment.page';
import { map } from 'rxjs/operators';

export interface Appointment {
  'key': string;
  'contact': string;
  'datetime': string;
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
  public showOnlyUpcoming = true;

  constructor(private db: AngularFireDatabase, private auth: AuthenticationService, public modalController: ModalController) {}

  ngOnInit() {
    this.getAppointmentList();
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

  getAppointmentList() {
    this.auth.observe((user: firebase.User) => {
      this.appointments = this.db
        .list<Appointment>('/users/' + this.auth.user.uid + '/appointments',
          ref => {
            if (this.showOnlyUpcoming) {
              return ref.orderByChild('datetime').startAt(this.getNowDateIsoString());
            } else {
              return ref.orderByChild('datetime');
            }
          }
        )
        .snapshotChanges().pipe(map((mutation: any[]) => mutation.map(p => {
          const appt: Appointment = p.payload.val();
          appt.key = p.key;
          return appt;
        })));
    });
  }

  checkboxChange($event: CustomEvent) {
    this.showOnlyUpcoming = $event.detail.checked;
    this.getAppointmentList();
  }

  async addAppointment() {
    const modal = await this.modalController.create({
      component: NewAppointmentPage
    });
    return await modal.present();
  }

  async edit(key: string) {
    const modal = await this.modalController.create({
      component: NewAppointmentPage,
      componentProps: { key }
    });
    return await modal.present();
  }

  parseDate(dateString: string): string {
    return new Date(dateString).toLocaleString().replace(', ', '<br/>');
  }

}
