import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes, Router } from '@angular/router';
import { FirebaseDataService } from './services/firebasedata.service';
import { ModalController } from '@ionic/angular';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canLoad: [FirebaseDataService]
  },
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  {
    path: 'new-appointment',
    loadChildren: () => import('./tab1/new-appointment/new-appointment.module').then( m => m.NewAppointmentPageModule)
  },
  {
    path: 'location-detail',
    loadChildren: () => import('./tab2/location-detail/location-detail.module').then( m => m.LocationDetailPageModule)
  },
  {
    path: 'splash',
    loadChildren: () => import('./splash/splash.module').then( m => m.SplashPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, initialNavigation: 'enabled' })
  ],
  exports: [RouterModule],
  providers: [FirebaseDataService]
})
export class AppRoutingModule {

  user: firebase.User = null;

  constructor() {}

}
