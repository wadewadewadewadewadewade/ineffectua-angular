// From https://www.freakyjolly.com/ionic-4-firebase-login-registration-by-email-and-password/
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { first } from 'rxjs/operators';

export interface Credentials {
  email: string;
  password: string;
}

@Injectable()
export class AuthenticateService {

  authenticatedUrl = '/tabs/calendar';
  user: firebase.User;

  constructor(private angularFireAuth: AngularFireAuth) {}

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
        .then(() => {
          console.log('Log Out');
          this.user = null;
          resolve();
        }).catch((error) => {
          reject();
        });
      }
    });
  }

  isLoggedIn() {
    return this.angularFireAuth.authState.pipe(first()).toPromise();
  }

  async getUser(success: any, fail?: any) {
    const user = await this.isLoggedIn();
    if (user) {
      success(user);
    } else {
      fail();
    }
  }

  observe(success: any, fail: any): void {
    this.angularFireAuth.onAuthStateChanged((user: firebase.User) => {
      if (user) {
        this.user = user; // since this gets called right at app load, save this user for later
        success(user);
      } else {
        fail();
      }
    });
  }

}
