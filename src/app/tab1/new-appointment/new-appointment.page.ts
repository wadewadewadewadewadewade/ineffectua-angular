import { map } from 'rxjs/operators';
import { Appointment } from './../calendar.page';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthenticationService } from '../../services/authentication.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ModalController, NavParams, AlertController } from '@ionic/angular';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-new-appointment',
  templateUrl: './new-appointment.page.html',
  styleUrls: ['./new-appointment.page.scss'],
})
export class NewAppointmentPage implements OnInit {

  validationsForm: FormGroup;
  errorMessage = '';
  validationMessages = {
    datetime: [
      { type: 'required', message: 'Date/Time is required.' },
      { type: 'pattern', message: 'Please enter a valid Date and Time.' }
    ],
    title: [
      { type: 'required', message: 'Title is required.' },
      { type: 'minlength', message: 'Title must be at least 5 characters long.' }
    ]
  };
  picker = '';
  key: string;

  constructor(
    private title: Title,
    private db: AngularFireDatabase,
    private auth: AuthenticationService,
    private formBuilder: FormBuilder,
    public modalController: ModalController,
    public navParams: NavParams,
    public alertController: AlertController
  ) {

  }

  ngOnInit() {
    this.validationsForm = this.formBuilder.group({
      datetime: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(
          '([0-2][0-9]{3})\-([0-1][0-9])\-([0-3][0-9])T([0-5][0-9])\:([0-5][0-9])\:([0-5][0-9](\.[0-9]{3})?)(Z|([\-\+]([0-1][0-9])\:00))'
        )
      ])),
      title: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
      contact: new FormControl(''),
      location: new FormControl(''),
      description: new FormControl('')
    });
    this.key = this.navParams.get('key');
    if (this.key) {
      this.title.setTitle('Edit Appointment');
      this.auth.observe((user: firebase.User) => {
        this.db.list('/users/' + user.uid + '/appointments', ref => ref.orderByKey().equalTo(this.key))
        .snapshotChanges().pipe(map((mutation: any[]) => mutation.map(p => {
          const appt: Appointment = p.payload.val();
          appt.key = p.key;
          return appt;
        })))
          .subscribe((appt: Appointment[]) => {
            this.picker = appt[0].datetime;
            this.validationsForm.controls.datetime.setValue(appt[0].datetime);
            this.validationsForm.controls.title.setValue(appt[0].title);
            this.validationsForm.controls.contact.setValue(appt[0].contact);
            this.validationsForm.controls.location.setValue(appt[0].location);
            this.validationsForm.controls.description.setValue(appt[0].description);
        });
      });
    } else {
      this.title.setTitle('New Appointment');
    }
  }

  updateDate($event: CustomEvent) {
    this.validationsForm.patchValue({ datetime: $event.detail.value });
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true
    });
  }

  async deleteAppointment() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure you would like to delete this appointment?',
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
            if (this.key && user) {
              this.db.list('/users/' + user.uid + '/appointments').remove(this.key);
              this.dismiss();
            }
          }
        }
      ]
    });
    await alert.present();
  }

  addAppointment(appt: Appointment) {
    const user = this.auth.user;
    if (user) {
      if (this.key) {
        delete appt.key;
        this.db.object('/users/' + user.uid + '/appointments/' + this.key).set(appt);
      } else {
        this.db.list('/users/' + user.uid + '/appointments').push(appt);
      }
      this.dismiss();
    }
  }

}
