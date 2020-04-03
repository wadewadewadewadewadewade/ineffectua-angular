import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PainLogPage } from './painlog.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { DraggableDirective } from '../draggable.directive';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: '', component: PainLogPage }])
  ],
  exports: [DraggableDirective],
  declarations: [PainLogPage, DraggableDirective]
})
export class PainLogPageModule {}
