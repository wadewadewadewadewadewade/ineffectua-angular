import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthenticationService, Credentials } from './services/authentication.service';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireModule } from '@angular/fire';

describe('AppComponent', () => {

  let statusBarSpy, splashScreenSpy, platformReadySpy, platformSpy;
  const DatabaseStub = {
    list: (name: string) => ({
      valueChanges: () => new BehaviorSubject({ foo: 'bar' }),
      snapshotChanges: () => new BehaviorSubject({ foo: 'bar' }),
      set: (_d: any) => new Promise((resolve, _reject) => resolve()),
      update: (_d: any) => new Promise((resolve, _reject) => resolve()),
      push: (_d: any) => new Promise((resolve, _reject) => resolve()),
    }),
    object: (name: string) => ({
      valueChanges: () => new BehaviorSubject({ foo: 'bar' }),
      snapshotChanges: () => new BehaviorSubject({ foo: 'bar' }),
      set: (_d: any) => new Promise((resolve, _reject) => resolve()),
      update: (_d: any) => new Promise((resolve, _reject) => resolve()),
      push: (_d: any) => new Promise((resolve, _reject) => resolve()),
    }),
  };
  class AuthStub extends AngularFireAuthModule {
    createUserWithEmailAndPassword(email: string, password: string): Promise<firebase.auth.UserCredential> {
      return new Promise<firebase.auth.UserCredential>((resolve, _reject) => resolve());
    }
    signInWithEmailAndPassword(email: string, password: string): Promise<firebase.auth.UserCredential> {
      return new Promise<firebase.auth.UserCredential>((resolve, _reject) => resolve());
    }
    onAuthStateChanged(fun: any) {

    }
  }
  class authenticationSpy extends AuthenticationService {
    isLoggedIn(): Promise<firebase.User> {
      return new Promise((resolve, _reject) => resolve());
    }
    registerUser(value: Credentials): Promise<any> {
      return new Promise((resolve, _reject) => resolve());
    }
    loginUser(value: Credentials): Promise<any> {
      return new Promise((resolve, _reject) => resolve());
    }
    logoutUser(): Promise<any> {
      return new Promise((resolve, _reject) => resolve());
    }
    observe(success: any, fail?: any): void {
      // do nothing
    }
  }

  beforeEach(async(() => {
    platformReadySpy = Promise.resolve();

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        AngularFireModule.initializeApp(environment.firebase),
        { provide: AngularFireDatabaseModule, useValue: DatabaseStub },
        { provide: AngularFireAuthModule, useValue: AuthStub },
        { provide: AuthenticationService, useClass: authenticationSpy },
        { provide: StatusBar, useValue: statusBarSpy },
        { provide: SplashScreen, useValue: splashScreenSpy },
        { provide: Platform, useValue: platformSpy },
      ],
      imports: [
        RouterTestingModule
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize the app', async () => {
    TestBed.createComponent(AppComponent);
    expect(platformSpy.ready).toHaveBeenCalled();
    await platformReadySpy;
    expect(statusBarSpy.styleDefault).toHaveBeenCalled();
    expect(splashScreenSpy.hide).toHaveBeenCalled();
  });

  // TODO: add more tests!

});
