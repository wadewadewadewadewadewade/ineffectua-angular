import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CalendarPage } from './calendar.page';
import { FirebaseDataService, Credentials } from '../services/firebasedata.service';

describe('CalendarPage', () => {
  let component: CalendarPage;
  let fixture: ComponentFixture<CalendarPage>;
  class AuthenticationSpy extends FirebaseDataService {
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
    TestBed.configureTestingModule({
      declarations: [CalendarPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
