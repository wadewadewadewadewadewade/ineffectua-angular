import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { FirebaseDataService, Appointment } from '../services/firebasedata.service';

// Calendar API credentials
import { BehaviorSubject } from 'rxjs';

// new appointment
import { ModalController } from '@ionic/angular';
import { NewAppointmentPage } from './new-appointment/new-appointment.page';

@Component({
  selector: 'app-calendar',
  templateUrl: 'calendar.page.html',
  styleUrls: ['calendar.page.scss']
})
export class CalendarPage implements OnInit {

  private collection = 'appointments';
  public appointments: BehaviorSubject<Appointment[]>;
  public showOnlyUpcoming = true;

  constructor(
    private title: Title,
    private db: FirebaseDataService,
    public modalController: ModalController
  ) {
    this.title.setTitle('Appointments');
  }

  ngOnInit() {
    this.db.observe(() => {
      this.appointments = this.db
        .get<Appointment>(this.collection,
          ref => {
            if (this.showOnlyUpcoming) {
              return ref.orderByChild('datetime').startAt(this.getNowDateIsoString());
            } else {
              return ref.orderByChild('datetime');
            }
          }
      );
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

  checkboxChange($event: CustomEvent) {
    this.showOnlyUpcoming = $event.detail.checked;
    this.appointments = this.db
      .get<Appointment>(this.collection,
        ref => {
          if (this.showOnlyUpcoming) {
            return ref.orderByChild('datetime').startAt(this.getNowDateIsoString());
          } else {
            return ref.orderByChild('datetime');
          }
        }
    );
    this.appointments.next(null);
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
