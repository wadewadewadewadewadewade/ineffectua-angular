import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthenticateService } from '../../services/authentication.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Appointment } from '../calendar.page';
import { ModalController } from '@ionic/angular';

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

  constructor(private db: AngularFireDatabase, private auth: AuthenticateService, private formBuilder: FormBuilder, public modalController: ModalController) {}

  ngOnInit() {
    this.validationsForm = this.formBuilder.group({
      datetime: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('([0-2][0-9]{3})\-([0-1][0-9])\-([0-3][0-9])T([0-5][0-9])\:([0-5][0-9])\:([0-5][0-9])(Z|([\-\+]([0-1][0-9])\:00))')
      ])),
      title: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
    });
  }

  add(appt: Appointment) {
    const user = this.auth.user;
    if (user) {
      this.db.object('/users/' + user.providerData[0].uid + '/appointments')
        .set(appt);
      this.modalController.dismiss({
        'dismissed': true
      });
    }
  }

}
