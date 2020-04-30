import { FirebaseDataService } from './services/firebasedata.service';
import { environment } from 'src/environments/environment';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Platform, ModalController } from '@ionic/angular';
import { BrowserModule, TransferState, BrowserTransferStateModule } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { Credentials } from './services/firebasedata.service';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabase, AngularFireDatabaseModule, QueryFn } from '@angular/fire/database';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAnalytics, AngularFireAnalyticsModule, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { AppComponent } from './app.component';

describe('AppComponent', () => {

  let platformReadySpy;
  const platformSpy = { ready: (): Promise<string> => new Promise<string>((resolve, reject) => resolve('ready')) },
    modalControllerSpy = {dismiss: () => { }},
    statusBarSpy = {styleDefault: (): void => undefined},
    splashScreenSpy = {hide: (): void => undefined},
    firebaseDataserviceStub = {
      isLoggedIn: () => new Promise<firebase.User>((resolve, _reject) => resolve()),
      saveUserAccountInformation: (res: firebase.User) => { return },
      registerUser: (value: Credentials) =>  new Promise<any>((resolve, reject) => resolve()),
      loginUser: (value: Credentials) =>  new Promise<any>((resolve, reject) => resolve()),
      logoutUser: () =>  new Promise<any>((resolve, reject) => resolve()),
      get: (collection: string, orderby?: QueryFn) => new BehaviorSubject<[]>([]),
      getItem: (collection: string, uid: string) => new Promise<any>((resolve, reject) => resolve()),
      put: (collection: string, val: any, orderby?: QueryFn) => new Promise<void>((resolve, reject) => resolve()),
      remove: (collection: string, val: any) => new Promise<void>((resolve, reject) => resolve()),
      observe: (success: any) => { return }
    }, authStub = {
      onAuthStateChanged: (user: firebase.User) => { return },
      signOut: () => new Promise<any>((resolve, reject) => resolve()),
      signInWithEmailAndPassword: (email: string, password: string) => new Promise<any>((resolve, reject) => resolve()),
      createUserWithEmailAndPassword: (email: string, password: string) => new Promise<any>((resolve, reject) => resolve()),
    }, databaseStub = {
      object: (path: string) => { return },
      list: (collection: string, orderby?: QueryFn) => ({
        snapshotChanges: () => new BehaviorSubject<[]>([]),
        remove: (val: string) => { return },
      }),
    }, analyticsStub = {

    };

  beforeEach(async(() => {
    platformReadySpy = Promise.resolve();

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: Platform, useValue: platformSpy },
        { provide: StatusBar, useValue: statusBarSpy },
        { provide: SplashScreen, useValue: splashScreenSpy },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: FirebaseDataService, useValue: firebaseDataserviceStub },
        { provide: AngularFireAuthModule, useValue: authStub },
        { provide: AngularFireDatabaseModule, useValue: databaseStub },
        { provide: AngularFireAnalyticsModule, useValue: analyticsStub },
        TransferState,
        BrowserTransferStateModule,
        ScreenTrackingService,
        UserTrackingService,
      ],
      imports: [
        RouterTestingModule,
        AngularFireModule.initializeApp(environment.firebase),
        BrowserModule.withServerTransition({ appId: 'serverApp' }),
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
    // expect(platformSpy.ready).toHaveBeenCalled();
    await platformReadySpy;
    // expect(StatusBar).toHaveBeenCalled();
    // expect(splashScreenSpy.hide).toHaveBeenCalled();
  });

  // TODO: add more tests!

});
