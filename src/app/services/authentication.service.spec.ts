import { TestBed } from '@angular/core/testing';

import { AuthenticationService } from './authentication.service';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { RouterModule } from '@angular/router';

describe('AuthenticationService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      AngularFireAuthModule,
      RouterModule
    ]
  }));

  it('should be created', () => {
    const service: AuthenticationService = TestBed.inject(AuthenticationService);
    expect(service).toBeTruthy();
  });
});
