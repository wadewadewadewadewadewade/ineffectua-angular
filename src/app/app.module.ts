import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Authentication
import { environment } from 'src/environments/environment';
import { FirebaseDataService } from './services/firebasedata.service';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAnalyticsModule, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';

// Appointments
import { NewAppointmentPageModule } from './tab1/new-appointment/new-appointment.module';
// Painlog
import { AngularDraggableModule } from 'angular2-draggable';
import { LocationDetailPageModule } from './tab2/location-detail/location-detail.module';
// import { SplashPageModule } from './splash/splash.module';
import { SplashPage } from './splash/splash.page';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [
    SplashPage,
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    IonicModule.forRoot(),
    AppRoutingModule,
    NewAppointmentPageModule,
    LocationDetailPageModule,
    AngularDraggableModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireAnalyticsModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    FirebaseDataService,
    ScreenTrackingService,
    UserTrackingService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
