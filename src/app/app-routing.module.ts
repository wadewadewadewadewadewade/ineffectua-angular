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
    path: 'app',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  }
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
    if (this.authService.userDetails()) {
      // All's fine, proceed
    } else {
      if (this.router.url !== '/') {
        console.log('router.url=', this.router.url);
        this.router.navigateByUrl('/');
      }
    }
  }

  logout() {
    this.authService.logoutUser()
    .then(res => {
      console.log(res);
      this.router.navigateByUrl('/');
    })
    .catch(error => {
      console.log(error);
    });
  }

}
