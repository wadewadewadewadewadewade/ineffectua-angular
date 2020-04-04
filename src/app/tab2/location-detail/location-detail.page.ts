import { map } from 'rxjs/operators';
import { Location } from '../painlog.page';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthenticationService } from '../../services/authentication.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ModalController, NavParams, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-location-detail',
  templateUrl: './location-detail.page.html',
  styleUrls: ['./location-detail.page.scss'],
})
export class LocationDetailPage implements OnInit {

  validationsForm: FormGroup;
  errorMessage = '';
  validationMessages = {
    added: [
      { type: 'required', message: 'Date/Time is required.' },
      { type: 'pattern', message: 'Please enter a valid Date and Time.' }
    ],
    removed: [
      { type: 'required', message: 'Date/Time is required.' },
      { type: 'pattern', message: 'Please enter a valid Date and Time.' }
    ],
    label: [
      { type: 'required', message: 'Label is required.' },
      { type: 'minlength', message: 'Label must be at least 5 characters long.' }
    ]
  };
  addedPicker = '';
  removedPicker = '';
  location: Location;

  constructor(private db: AngularFireDatabase,
    private auth: AuthenticationService,
    private formBuilder: FormBuilder,
    public modalController: ModalController,
    public navParams: NavParams,
    public alertController: AlertController) { }

  ngOnInit() {
    this.validationsForm = this.formBuilder.group({
      added: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('([0-2][0-9]{3})\-([0-1][0-9])\-([0-3][0-9])T([0-5][0-9])\:([0-5][0-9])\:([0-5][0-9](\.[0-9]{3})?)(Z|([\-\+]([0-1][0-9])\:00))')
      ])),
      label: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
      removed: new FormControl(''),
      severity: new FormControl(''),
      description: new FormControl('')
    });
    this.location = this.navParams.get('location');
    if (this.location) {
      this.auth.observe((user: firebase.User) => {
        this.db
          .list<Location>('/users/' + this.auth.user.uid + '/painlog',
            ref => ref.orderByKey().equalTo(this.location.key)
          )
          .snapshotChanges().pipe(map((mutation: any[]) => mutation.map(p => {
            const loc: Location = p.payload.val();
            loc.key = p.key;
            return loc;
          }))).subscribe((loc: Location[]) => {
            this.addedPicker = loc[0].added;
            this.removedPicker = loc[0].removed;
            this.validationsForm.controls.added.setValue(loc[0].added);
            this.validationsForm.controls.removed.setValue(loc[0].removed);
            this.validationsForm.controls.label.setValue(loc[0].label);
            this.validationsForm.controls.severity.setValue(loc[0].severity);
            this.validationsForm.controls.description.setValue(loc[0].description);
        });
      })
    }
  }

  updateDate($event: CustomEvent, isAdded: boolean) {
    if (isAdded) {
      this.validationsForm.patchValue({ added: $event.detail.value });
    } else {
      this.validationsForm.patchValue({ removed: $event.detail.value });
    }
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  updateLocation(loc: Location) {
    const user = this.auth.user;
    if (user) {
      if (this.location) {
        loc.x = this.location.x;
        loc.y = this.location.y;
        this.db.object('/users/' + user.uid + '/painlog/' + this.location.key).set(loc);
      }
    }
    this.dismiss();
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

  async deleteLocation() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure you would like to delete this location?',
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
            if (user) {
              if (this.location) {
                this.location.removed = this.getNowDateIsoString();
                this.updateLocation(this.location);
              }
            }
          }
        }
      ]
    });
    await alert.present();
  }

}
