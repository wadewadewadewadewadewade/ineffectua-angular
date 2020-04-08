import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthenticationService, Credentials } from '../services/authentication.service';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { __classPrivateFieldGet } from 'tslib';
import { TransferState, makeStateKey, Title } from '@angular/platform-browser';

// make state key in state to store users
const STATE_KEY_USER = makeStateKey('user');

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {


  validationsForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  validationMessages = {
   email: [
     { type: 'required', message: 'Email is required.' },
     { type: 'pattern', message: 'Enter a valid email.' }
   ],
   password: [
     { type: 'required', message: 'Password is required.' },
     { type: 'minlength', message: 'Password must be at least 5 characters long.' }
   ]
 };

  constructor(
    private title: Title,
    private db: AngularFireDatabase,
    private router: Router,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private state: TransferState
  ) {
    this.title.setTitle('register');
  }

  ngOnInit() {
    this.validationsForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
    });
  }

  saveUserAccountInformation(res: firebase.User) {
    if (res) {
      res.providerData.forEach(profile => {
        this.db.object<firebase.UserInfo>('/users/' + res.uid + '/account').set(profile);
      });
    }
  }

  tryRegister(value: Credentials) {
    this.authService.registerUser(value)
     .then(res => {
       // console.log(res);
       this.state.set(STATE_KEY_USER, res.user as firebase.User);
       this.saveUserAccountInformation(res.user);
       this.errorMessage = '';
       this.successMessage = 'Your account has been created.';
       this.router.navigate([this.authService.authenticatedUrl], { replaceUrl: true });
     }, err => {
       // console.log(err);
       this.errorMessage = err.message;
       this.successMessage = '';
     });
  }

  goLoginPage() {
    this.router.navigate(['/'], { replaceUrl: true });
  }


}
