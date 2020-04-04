import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewAppointmentPage } from './new-appointment.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('NewAppointmentPage', () => {
  let component: NewAppointmentPage;
  let fixture: ComponentFixture<NewAppointmentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewAppointmentPage ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        IonicModule.forRoot()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NewAppointmentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
