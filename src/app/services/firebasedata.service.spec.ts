import { TestBed } from '@angular/core/testing';

import { FirebaseDataService } from './firebasedata.service';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { RouterModule } from '@angular/router';

describe('FirebaseDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      AngularFireAuthModule,
      RouterModule
    ]
  }));

  it('should be created', () => {
    const service: FirebaseDataService = TestBed.inject(FirebaseDataService);
    expect(service).toBeTruthy();
  });
});
