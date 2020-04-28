import { TestBed } from '@angular/core/testing';

import { ClientManagementService } from './client-management.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppConfigService } from 'src/app/app-config.service';

describe('ClientManagementService', () => {
  let service: ClientManagementService;
  let appConfigService;
  let http: HttpTestingController;

  beforeEach(() => {
    appConfigService = jasmine.createSpyObj(['getKeycloakBaseUrl']);
    appConfigService.getIamApiBaseUrl.and.returnValue('https://kc.test.example/');
    TestBed.configureTestingModule(
      {
        imports: [
          HttpClientTestingModule
        ],
        providers: [
          { provide: AppConfigService, useValue: appConfigService }
        ],
      }
    );
    service = TestBed.inject(ClientManagementService);
    http = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
