import { AngularFireDatabase, QueryFn } from '@angular/fire/database';
import { first, map } from 'rxjs/operators';
// From https://www.freakyjolly.com/ionic-4-firebase-login-registration-by-email-and-password/
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router, CanLoad } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { Observable } from 'rxjs';
import { makeStateKey, TransferState } from '@angular/platform-browser';

export class Credentials {
  email: string;
  password: string;
}

export class Location {
  'key': string;
  'x': string;
  'y': string;
  'severity': number;
  'added': string;
  'removed': string;
  'label': string;
  'description': string;
}

export class Appointment {
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

  private saveUserAccountInformation(res: firebase.User) {
    if (res) {
      res.providerData.forEach(profile => {
        this.db.object<firebase.UserInfo>('/users/' + res.uid + '/account').set(profile);
      });
    }
  }

  registerUser(value: Credentials) {
    return new Promise<any>((resolve, reject) => {
      this.angularFireAuth.createUserWithEmailAndPassword(value.email, value.password)
        .then(
          res => {
            this.state.set(this.STATE_KEY_USER, res.user as firebase.User);
            this.saveUserAccountInformation(res.user);
            this.router.navigate([this.authenticatedUrl], { replaceUrl: true });
            resolve(res);
          },
          err => reject(err));
    });
  }

  loginUser(value: Credentials) {
   return new Promise<any>((resolve, reject) => {
      this.angularFireAuth.signInWithEmailAndPassword(value.email, value.password)
        .then(
          res => {
            this.state.set(this.STATE_KEY_USER, res.user as firebase.User);
            this.router.navigate([this.authenticatedUrl], { replaceUrl: true });
            resolve(res);
          },
          err => reject(err));
   });
  }

  logoutUser() {
    return new Promise((resolve, reject) => {
      if (this.angularFireAuth.currentUser) {
        this.angularFireAuth.signOut()
        .then(res => {
          this.state.remove(this.STATE_KEY_USER);
          this.router.navigate(['/']);
          resolve();
        })
        .catch((error) => reject());
      }
    });
  }

  /*type Constructor<T> = { new (...args: any[]): T }; https://dev.to/krumpet/generic-type-guard-in-typescript-258l
  function typeGuard<T>(o, className: Constructor<T>): o is T {
    return o instanceof className;
  }*/

  private isReallyInstanceOf<T>(ctor: { new(...args: any[]): T }, obj: T) {
    return obj instanceof ctor;
  }

  /* General toold for inserting new or updating existing log entrties */
  get<T>(orderby?: QueryFn): Observable<T[]> {
    const path = ['users'],
      dummy: T = null as T,
      d2: Location = null as Location,
      collection =
        this.isReallyInstanceOf<T>(dummy, d2) ? 'painlog'
        : this.isReallyInstanceOf<T>(dummy, Appointment) ? 'appointments'
        : 'account';
        // needs reading here: https://github.com/Microsoft/TypeScript/wiki/FAQ#why-cant-i-write-typeof-t-new-t-or-instanceof-t-in-my-generic-function
    if (this.user) {
      path.push(this.user.uid);
      path.push(collection);
      console.log('/' + path.join('/'));
      return this.db
        .list<T>('/' + path.join('/'), orderby)
        .snapshotChanges().pipe(map((mutation: any[]) => mutation.map(p => {
          const ret: T = p.payload.val();
          console.log(typeof ret, ret);
          if (p.key) {
            const key = p.key();
            return {...ret, key};
          } else {
            return ret;
          }
        })));
    }
  }

  /* General toold for inserting new or updating existing log entrties */
  put<T>(val: T, orderby?: QueryFn): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const path = ['users'],
        type: T = null,
        collection =
          type instanceof Location ? 'painlog'
          : type instanceof Appointment ? 'appointments'
          : 'account';
          // needs reading here: https://github.com/Microsoft/TypeScript/wiki/FAQ#why-cant-i-write-typeof-t-new-t-or-instanceof-t-in-my-generic-function
      if (this.user) {
        path.push(this.user.uid);
        path.push(collection);
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
        resolve();
      } else {
        reject();
      }
    })
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

  observe(success: any): void {
    this.angularFireAuth.onAuthStateChanged((user: firebase.User) => {
      if (user) {
        this.user = user;
        success(user);
      } else {
        this.user = null;
        this.logoutUser();
      }
    }, (err) => {
      this.logoutUser();
    });
  }

}
