// From https://www.freakyjolly.com/ionic-4-firebase-login-registration-by-email-and-password/
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { first } from 'rxjs/operators';

export interface Credentials {
  email: string;
  password: string;
}

@Injectable()
export class AuthenticationService {

  authenticatedUrl = '/tabs/calendar';
  user: firebase.User;

  constructor(private angularFireAuth: AngularFireAuth) {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.user = JSON.parse(userJson);
    }
  }

  registerUser(value: Credentials) {
   return new Promise<any>((resolve, reject) => {
     this.angularFireAuth.createUserWithEmailAndPassword(value.email, value.password)
     .then(
       res => resolve(res),
       err => reject(err));
   });
  }

  loginUser(value: Credentials) {
   return new Promise<any>((resolve, reject) => {
     this.angularFireAuth.signInWithEmailAndPassword(value.email, value.password)
     .then(
       res => resolve(res),
       err => reject(err));
   });
  }

  logoutUser() {
    return new Promise((resolve, reject) => {
      if (this.angularFireAuth.currentUser) {
        this.angularFireAuth.signOut()
        .then(() => resolve())
        .catch((error) => reject());
      }
    });
  }

  observe(success: any, fail?: any): void {
    this.angularFireAuth.onAuthStateChanged((user: firebase.User) => {
      if (user) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(user));
        success(user);
      } else {
        this.user = null;
        localStorage.removeItem('user');
        if (fail) {
          fail();
        }
      }
    });
  }

}
