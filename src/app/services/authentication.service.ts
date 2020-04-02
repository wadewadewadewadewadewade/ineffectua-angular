import { first } from 'rxjs/operators';
// From https://www.freakyjolly.com/ionic-4-firebase-login-registration-by-email-and-password/
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRouteSnapshot, CanLoad } from '@angular/router';
import { Route } from '@angular/compiler/src/core';

export interface Credentials {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements CanLoad {

  authenticatedUrl = '/tabs/calendar';
  user: firebase.User;

  constructor(private angularFireAuth: AngularFireAuth) {}

  canLoad(route: Route): Promise<boolean> {
    return new Promise(resolve =>
      this.isLoggedIn()
        .then(user => {
          resolve(user !== null);
        })
        .catch(() => {
          resolve(false);
        })
    );
  }

  isLoggedIn() {
    return this.angularFireAuth.authState.pipe(first()).toPromise();
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
        success(user);
      } else {
        this.user = null;
        if (fail) {
          fail();
        }
      }
    });
  }

}
