import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocationDetailPageRoutingModule } from './location-detail-routing.module';

import { LocationDetailPage } from './location-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocationDetailPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [LocationDetailPage]
})
export class LocationDetailPageModule {}
