import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PainLogPage } from './painlog.page';
import { AngularDraggableModule } from 'angular2-draggable';
import { LocationdatefilterPipe } from './locationdatefilter.pipe';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    AngularDraggableModule,
    RouterModule.forChild([{ path: '', component: PainLogPage }])
  ],
  declarations: [PainLogPage, LocationdatefilterPipe]
})
export class PainLogPageModule {}
