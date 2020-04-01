import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarPage } from './calendar.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { AngularFireDatabaseModule } from '@angular/fire/database';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    AngularFireDatabaseModule,
    RouterModule.forChild([{ path: '', component: CalendarPage }]),
  ],
  declarations: [CalendarPage]
})
export class CalendarPageModule {}
