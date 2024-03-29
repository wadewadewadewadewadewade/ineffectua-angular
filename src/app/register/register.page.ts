import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FirebaseDataService, Credentials } from '../services/firebasedata.service';
import { Router } from '@angular/router';
import { makeStateKey, Title } from '@angular/platform-browser';

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
    private router: Router,
    private authService: FirebaseDataService,
    private formBuilder: FormBuilder
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

  tryRegister(value: Credentials) {
    this.authService.registerUser(value)
     .then(res => {
       // console.log(res);
       this.errorMessage = '';
       this.successMessage = 'Your account has been created.';
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
