import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes, Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
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
    canLoad: [AuthenticationService]
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
  providers: [AuthenticationService]
})
export class AppRoutingModule {

  userProfile: any = null;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private modalController: ModalController
  ) {
    this.authService.observe((user: firebase.User) => {
      if (this.router.url.indexOf('/tabs/') < 0) {
        this.router.navigate([this.authService.authenticatedUrl], { replaceUrl: true })
          .then(res => { this.modalController.dismiss(); });
      }
     }, () => {
      if (this.router.url !== '/') {
        this.router.navigate(['/'])
          .then(res => { this.modalController.dismiss(); });
      }
    });
  }

}
