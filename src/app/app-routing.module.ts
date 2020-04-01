import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes, Router } from '@angular/router';

import { AuthenticateService } from './services/authentication.service';

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
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, initialNavigation: 'enabled' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {

  userProfile: any = null;

  constructor(private authService: AuthenticateService, private router: Router) {
    this.authService.observe((user: firebase.User) => {
      if (this.router.url.indexOf('/tabs/') < 0) {
        this.router.navigate([this.authService.authenticatedUrl], { replaceUrl: true });
      }
     }, () => {
      if (this.router.url !== '/') {
        this.router.navigate(['/']);
      }
    });
  }

  logout() {
    this.authService.logoutUser()
    .then(res => {
      console.log(res);
      this.router.navigate(['/']);
    })
    .catch(error => {
      console.log(error);
    });
  }

}
