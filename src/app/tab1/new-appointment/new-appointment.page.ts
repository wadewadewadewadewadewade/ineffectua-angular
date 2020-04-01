import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthenticationService } from '../../services/authentication.service';
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
  datetimeHotfix = new FormControl('');

  constructor(private db: AngularFireDatabase, private auth: AuthenticationService, private formBuilder: FormBuilder, public modalController: ModalController) {
    this.datetimeHotfix.valueChanges.subscribe((val: string) => {
      this.validationsForm.patchValue({ datetime: val});
    })
  }

  ngOnInit() {
    this.validationsForm = this.formBuilder.group({
      datetime: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('([a-z]+)\s([0-9]{1,2})\s([0-9]{4})\s([0-9]{1,2})\:([0-9]{2})(AM|PM)')
      ])),
      title: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
      contact: new FormControl(''),
      location: new FormControl(''),
      description: new FormControl('')
    });
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  addAppointment(appt: Appointment) {
    const user = this.auth.user;
    if (user) {
      this.db.object('/users/' + user.providerData[0].uid + '/appointments')
        .set(appt);
      this.dismiss();
    }
  }

}
