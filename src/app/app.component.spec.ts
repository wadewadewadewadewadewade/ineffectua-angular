import { environment } from 'src/environments/environment';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Platform, ModalController } from '@ionic/angular';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import { AppComponent } from './app.component';

describe('AppComponent', () => {

  let platformReadySpy;
  const platformSpy = { ready: (): Promise<string> => new Promise<string>((resolve, reject) => resolve('ready')) },
    modalControllerSpy = {dismiss: () => { }},
    statusBarSpy = {styleDefault: (): void => undefined},
    splashScreenSpy = {hide: (): void => undefined};

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
      ],
      imports: [
        RouterTestingModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        AngularFireDatabaseModule,
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
