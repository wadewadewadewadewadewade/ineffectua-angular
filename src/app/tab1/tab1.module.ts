import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { NG_GAPI_CONFIG, GoogleApiModule } from 'ng-gapi';
import credentials from './credentials.json';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: '', component: Tab1Page }]),
    GoogleApiModule.forRoot({
      provide: NG_GAPI_CONFIG,
      useValue: credentials.installed
    }),
  ],
  declarations: [Tab1Page]
})
export class Tab1PageModule {}
