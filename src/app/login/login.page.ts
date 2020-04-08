import { TransferState, makeStateKey, Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService, Credentials } from '../services/authentication.service';

// make state key in state to store users
const STATE_KEY_USER = makeStateKey('user');

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  validationsForm: FormGroup;
  errorMessage = '';
  validationMessages = {
    email: [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' }
    ],
    password: [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' }
    ]
  };

  constructor(
    private title: Title,
    private router: Router,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private state: TransferState
  ) {
    this.title.setTitle('login');
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

  loginUser(value: Credentials) {
    this.authService.loginUser(value)
    .then(res => {
      // console.log(res);
      this.state.set(STATE_KEY_USER, res.user as firebase.User);
      this.errorMessage = '';
      this.router.navigate([this.authService.authenticatedUrl], { replaceUrl: true });
    }, err => {
      this.errorMessage = err.message;
    });
  }

  goToRegisterPage() {
    this.router.navigate(['/register'], { replaceUrl: true });
  }

}
