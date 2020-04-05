import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Authentication
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './services/authentication.service';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';

// Appointments
import { NewAppointmentPageModule } from './tab1/new-appointment/new-appointment.module';
// Painlog
import { AngularDraggableModule } from 'angular2-draggable';
import { LocationDetailPageModule } from './tab2/location-detail/location-detail.module';
import { SplashPageModule } from './splash/splash.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    IonicModule.forRoot(),
    AppRoutingModule,
    NewAppointmentPageModule,
    LocationDetailPageModule,
    SplashPageModule,
    AngularDraggableModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
  ],
  providers: [
    StatusBar,
    AuthenticationService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
