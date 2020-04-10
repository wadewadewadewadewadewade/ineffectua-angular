import { AngularFireDatabase, QueryFn } from '@angular/fire/database';
import { first, map } from 'rxjs/operators';
// From https://www.freakyjolly.com/ionic-4-firebase-login-registration-by-email-and-password/
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router, CanLoad } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { Observable } from 'rxjs';
import { makeStateKey, TransferState } from '@angular/platform-browser';

export interface Credentials {
  email: string;
  password: string;
}

export interface Location {
  'key': string;
  'x': string;
  'y': string;
  'severity': number;
  'added': string;
  'removed': string;
  'label': string;
  'description': string;
}

export interface Appointment {
  'key': string;
  'contact': string;
  'datetime': string;
  'description': string;
  'location': string;
  'title': string;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseDataService implements CanLoad {

  authenticatedUrl = '/tabs/calendar';
  user: firebase.User;
  STATE_KEY_USER = makeStateKey('user');

  constructor(
    private angularFireAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router,
    private state: TransferState
  ) {
    this.user = this.state.get(this.STATE_KEY_USER, null);
    if (!this.user) {
      this.router.navigate(['/'])
        .then(res => { /* this.modalController.dismiss(); */ });
    }
    this.observe((user: firebase.User) => {
      if (this.router.url.indexOf('/tabs/') < 0) {
        this.router.navigate([this.authenticatedUrl], { replaceUrl: true })
          .then(res => { /* this.modalController.dismiss(); */ });
      }
     }, () => {
      if (this.router.url !== '/') {
        this.router.navigate(['/'])
          .then(res => { /* this.modalController.dismiss(); */ });
      }
    });
  }

  canLoad(route: Route): Promise<boolean> {
    return new Promise(resolve =>
      this.isLoggedIn()
        .then(user => {
          if (user) {
            resolve(user !== null);
          } else {
            this.router.navigate(['/']);
          }
        })
        .catch(() => {
          this.router.navigate(['/']);
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
        .then(res => {
          console.log(res);
          this.state.remove(this.STATE_KEY_USER);
          this.router.navigate(['/']);
          resolve()
        })
        .catch((error) => reject());
      }
    });
  }

  /* General toold for inserting new or updating existing log entrties */
  data<T>(val: T, orderby?: QueryFn, dates?: string[]): Observable<T[]> {
    const path = ['users'],
      collection = typeof val === typeof Location ? 'painlog' : 'appointment';
    if (this.user) {
      path.push(this.user.uid);
      path.push(collection);
      if (val) {
        const key =  Object.keys(val).find(obj => obj === 'key');
        if (key) {
          path.push(key);
          for (const prop in val) {
            if (val.hasOwnProperty(prop) && prop === 'key') {
              delete val[prop];
            }
          }
          this.db.object('/' + path.join('/')).set(val);
        } else {
          this.db.list('/' + path.join('/'), orderby).push(val);
        }
    } else {
      return this.db
        .list<T>('/' + path.join('/'), orderby)
        .snapshotChanges().pipe(map((mutation: any[]) => mutation.map(p => {
          const ret: T = p.payload.val(),
            key = p.key();
          return {...ret, key};
        })));
      }
    }
  }

  remove<T>(val: T) {
    const path = ['users'],
      collection = typeof val === typeof Location ? 'painlog' : 'appointment';
    if (this.user) {
      path.push(this.user.uid);
      path.push(collection);
      const key =  Object.keys(val).find(obj => obj === 'key');
      this.db
        .list<T>('/' + path.join('/'))
        .remove(key);
    }
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
