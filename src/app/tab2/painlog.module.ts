import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PainLogPage } from './painlog.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { AngularDraggableModule } from 'angular2-draggable';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    AngularDraggableModule,
    RouterModule.forChild([{ path: '', component: PainLogPage }])
  ],
  declarations: [PainLogPage]
})
export class PainLogPageModule {}
