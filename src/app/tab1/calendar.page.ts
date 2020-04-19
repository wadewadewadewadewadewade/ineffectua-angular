import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { FirebaseDataService, Appointment } from '../services/firebasedata.service';

// Calendar API credentials
import { BehaviorSubject } from 'rxjs';

// new appointment
import { ModalController } from '@ionic/angular';
import { NewAppointmentPage } from './new-appointment/new-appointment.page';
import { app } from 'firebase';

@Component({
  selector: 'app-calendar',
  templateUrl: 'calendar.page.html',
  styleUrls: ['calendar.page.scss']
})
export class CalendarPage implements OnInit {

  private collection = 'appointments';
  private appointmentsBehaviorSubject: BehaviorSubject<Appointment[]>;
  public appointments: Appointment[] = [];
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
      this.appointmentsBehaviorSubject = this.db
        .get<Appointment>(this.collection,
          ref => {
            return ref.orderByChild('datetime');
          }
      );
      this.appointmentsBehaviorSubject.subscribe(items => this.appointments = this.filterAppointments(items));
    });
  }

  filterAppointments(appointments: Appointment[]): Appointment[] {
    return appointments.filter(appointment => {
      if (this.showOnlyUpcoming && new Date(appointment.datetime) > new Date()) {
        return appointment;
      } else if (!this.showOnlyUpcoming) {
        return appointment;
      }
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
    this.appointments = this.filterAppointments(this.appointmentsBehaviorSubject.value);
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
