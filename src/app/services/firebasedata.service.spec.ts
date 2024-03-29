import { TestBed } from '@angular/core/testing';
import { FirebaseDataService } from './firebasedata.service';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserTransferStateModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('FirebaseDataService', () => {

  beforeEach(() => TestBed.configureTestingModule({
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    imports: [
      RouterTestingModule,
      BrowserTransferStateModule,
    ],
  }));

  it('should be created', () => {
    const service: FirebaseDataService = TestBed.inject(FirebaseDataService);
    expect(service).toBeTruthy();
  });
});