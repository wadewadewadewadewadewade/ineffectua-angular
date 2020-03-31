import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

// Tell Ionic components how to render on the server
import { IonicServerModule } from '@ionic/angular-server';

// for absolute URL support
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { UniversalInterceptor } from './universal-interceptor';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    IonicServerModule
  ],
  bootstrap: [AppComponent],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: UniversalInterceptor,
    multi: true
  }],
})
export class AppServerModule {}
