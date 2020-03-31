// From https://www.freakyjolly.com/ionic-4-firebase-login-registration-by-email-and-password/
import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';

export interface Credentials {
  email: string;
  password: string;
}

@Injectable()
export class AuthenticateService {

  authenticatedUrl = '/tabs/calendar';

  constructor() {}

  registerUser(value: Credentials) {
   return new Promise<any>((resolve, reject) => {
     firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
     .then(
       res => resolve(res),
       err => reject(err));
   });
  }

  loginUser(value: Credentials) {
   return new Promise<any>((resolve, reject) => {
     firebase.auth().signInWithEmailAndPassword(value.email, value.password)
     .then(
       res => resolve(res),
       err => reject(err));
   });
  }

  logoutUser() {
    return new Promise((resolve, reject) => {
      if (firebase.auth().currentUser) {
        firebase.auth().signOut()
        .then(() => {
          console.log('Log Out');
          resolve();
        }).catch((error) => {
          reject();
        });
      }
    });
  }

  userDetails(): firebase.User {
    return firebase.auth().currentUser;
  }

  observe(success: any, fail: any): void {
    firebase.auth().onAuthStateChanged((user: firebase.User) => {
      if (user) {
        success(user);
      } else {
        fail();
      }
    })
    
  }

}
