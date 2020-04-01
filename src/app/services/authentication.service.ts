// From https://www.freakyjolly.com/ionic-4-firebase-login-registration-by-email-and-password/
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { first, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

export interface Credentials {
  email: string;
  password: string;
}

@Injectable()
export class AuthenticateService {

  authenticatedUrl = '/tabs/calendar';
  userId$ = new Subject<string>();

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
        success(user);
      } else {
        fail();
      }
    });
  }

}
