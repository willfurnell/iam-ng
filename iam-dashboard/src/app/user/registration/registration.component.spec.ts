import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationComponent } from './registration.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegistrationService } from './registration.service';
import { of, Observable, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { AppConfigService } from '../../app-config.service';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { RealmService } from '../../services/realm.service';
import { convertToParamMap } from '@angular/router';
import { BlockUIModule, BlockUIService } from 'ng-block-ui';
import { MatIconModule } from '@angular/material/icon';

class DummyComponent {

}

describe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;
  let rs;
  let spy: any;
  let fb: FormBuilder;
  let appConfigService;
  let httpClient;
  let realmService;
  let sb: MatSnackBar;

  beforeEach(async(() => {
    appConfigService = jasmine.createSpyObj(['getIamApiBaseUrl', 'attributeExists', 'getCustomAttribute']);
    appConfigService.getIamApiBaseUrl.and.returnValue('');
    appConfigService.attributeExists.and.returnValue(true);
    httpClient = jasmine.createSpyObj(['get', 'post']);
    realmService = jasmine.createSpyObj(['getRealms']);
    realmService.getRealms.and.returnValue(of(
      {
        totalResults: 5,
        itemsPerPage: 50,
        startIndex: 0,
        resources: [
          {
            name: 'alice'
          },
          {
            name: 'atlas'
          },
          {
            name: 'cms'
          },
          {
            name: 'iam'
          },
          {
            name: 'lhcb'
          }
        ]
      }
    ));

    rs = jasmine.createSpyObj(['getRegistrationConfig', 'createRegistration', 'emailExists', 'usernameExists']);
    rs.getRegistrationConfig.and.returnValue(
      of(
        {
          kind: 'RegistrationConfiguration',
          registrationEnabled: true,
          privacyPolicyUrl: 'https://alice.example.com/privacy',
          aupUrl: 'https://alice.example.com/aup'
        }
      )
    );

    TestBed.configureTestingModule({
      imports: [
        MatToolbarModule,
        MatCardModule,
        MatCheckboxModule,
        MatInputModule,
        MatButtonModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        MatSnackBarModule,
        BlockUIModule.forRoot(),
        MatIconModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          {
            path: '404',
            component: DummyComponent,
          }
        ])
      ],
      declarations: [
        RegistrationComponent,
      ],
      providers: [
        FormBuilder,
        { provide: RegistrationService, useValue: rs },
        { provide: AppConfigService, useValue: appConfigService },
        {
          provide: ActivatedRoute, useValue: {
            paramMap: of(
              convertToParamMap(of(
                {
                  realm: 'alice'
                }
              ))
            )
          }
        },
        { provide: HttpClient, useValue: httpClient },
        { provide: RealmService, useValue: realmService },
        MatSnackBar,
        BlockUIService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationComponent);
    rs = fixture.debugElement.injector.get(RegistrationService);
    fb = fixture.debugElement.injector.get(FormBuilder);
    sb = fixture.debugElement.injector.get(MatSnackBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.RegistrationForm.valid).toBeFalsy();
  });

  it('form is valid when all inputs are made', () => {
    expect(component.RegistrationForm.valid).toBeFalsy();
    component.RegistrationForm.controls.givenName.setValue('John');
    component.RegistrationForm.controls.familyName.setValue('Smith');
    component.RegistrationForm.controls.email.setValue('example@example.com');
    component.RegistrationForm.controls.username.setValue('JSmith');
    component.RegistrationForm.controls.notes.setValue('Requesting account');
    component.RegistrationForm.controls.aup.setValue(true);
    expect(component.RegistrationForm.valid).toBeTruthy();
  });

  it('form is invalid with bad email', () => {
    expect(component.RegistrationForm.valid).toBeFalsy();
    component.RegistrationForm.controls.givenName.setValue('John');
    component.RegistrationForm.controls.familyName.setValue('Smith');
    component.RegistrationForm.controls.email.setValue('example.com');
    component.RegistrationForm.controls.username.setValue('JSmith');
    component.RegistrationForm.controls.notes.setValue('Requesting account');
    component.RegistrationForm.controls.aup.setValue(true);
    expect(component.RegistrationForm.valid).toBeFalsy();
  });

  it('form is invalid with no AUP signed', () => {
    expect(component.RegistrationForm.valid).toBeFalsy();
    component.RegistrationForm.controls.givenName.setValue('John');
    component.RegistrationForm.controls.familyName.setValue('Smith');
    component.RegistrationForm.controls.email.setValue('example@example.com');
    component.RegistrationForm.controls.username.setValue('JSmith');
    component.RegistrationForm.controls.notes.setValue('Requesting account');
    component.RegistrationForm.controls.aup.setValue(false);
    expect(component.RegistrationForm.valid).toBeFalsy();
  });

  it('form is invalid with no givenName', () => {
    expect(component.RegistrationForm.valid).toBeFalsy();
    component.RegistrationForm.controls.familyName.setValue('Smith');
    component.RegistrationForm.controls.email.setValue('example@example.com');
    component.RegistrationForm.controls.username.setValue('JSmith');
    component.RegistrationForm.controls.notes.setValue('Requesting account');
    component.RegistrationForm.controls.aup.setValue(true);
    expect(component.RegistrationForm.valid).toBeFalsy();
  });

  it('form is invalid with no familyName', () => {
    expect(component.RegistrationForm.valid).toBeFalsy();
    component.RegistrationForm.controls.givenName.setValue('John');
    component.RegistrationForm.controls.email.setValue('example@example.com');
    component.RegistrationForm.controls.username.setValue('JSmith');
    component.RegistrationForm.controls.notes.setValue('Requesting account');
    component.RegistrationForm.controls.aup.setValue(true);
    expect(component.RegistrationForm.valid).toBeFalsy();
  });

  it('form is invalid with no username', () => {
    expect(component.RegistrationForm.valid).toBeFalsy();
    component.RegistrationForm.controls.givenName.setValue('John');
    component.RegistrationForm.controls.familyName.setValue('Smith');
    component.RegistrationForm.controls.email.setValue('example@example.com');
    component.RegistrationForm.controls.notes.setValue('Requesting account');
    component.RegistrationForm.controls.aup.setValue(true);
    expect(component.RegistrationForm.valid).toBeFalsy();
  });

  it('form is invalid with no notes', () => {
    expect(component.RegistrationForm.valid).toBeFalsy();
    component.RegistrationForm.controls.givenName.setValue('John');
    component.RegistrationForm.controls.familyName.setValue('Smith');
    component.RegistrationForm.controls.email.setValue('example@example.com');
    component.RegistrationForm.controls.username.setValue('JSmith');
    component.RegistrationForm.controls.aup.setValue(true);
    expect(component.RegistrationForm.valid).toBeFalsy();
  });

  it('validator null with username not in use', () => {
    rs.usernameExists.and.returnValue(false);
    const fg = fb.group({
      username: [''],
    });
    expect(component.usernameInUseValidator(fg)).toBeNull();
    expect(rs.usernameExists).toHaveBeenCalled();
  });

  it('validator true with username in use', () => {
    rs.usernameExists.and.returnValue(true);
    const fg = fb.group({
      username: [''],
    });
    expect(component.usernameInUseValidator(fg)).toBeTruthy();
    expect(rs.usernameExists).toHaveBeenCalled();
  });

  it('validator null with email not in use', () => {
    rs.emailExists.and.returnValue(false);
    const fg = fb.group({
      email: [''],
    });
    expect(component.emailInUseValidator(fg)).toBeNull();
    expect(rs.emailExists).toHaveBeenCalled();
  });

  it('validator true with email in use', () => {
    rs.emailExists.and.returnValue(true);
    const fg = fb.group({
      email: [''],
    });
    expect(component.emailInUseValidator(fg)).toBeTruthy();
    expect(rs.emailExists).toHaveBeenCalled();
  });

  it('success message shown with valid registration', () => {
    spy = spyOn(sb, 'open');
    rs.createRegistration.and.returnValue(
      of<any>(
        {
          message: 'Request created',
          requestId: 'a-b-c',
          requestChallenge: 'c-b-a'
        }
      )
    );

    expect(fixture.debugElement.query(By.css('regsuccess'))).toBeNull();

    component.RegistrationForm.controls.givenName.setValue('John');
    component.RegistrationForm.controls.familyName.setValue('Smith');
    component.RegistrationForm.controls.email.setValue('example@example.com');
    component.RegistrationForm.controls.username.setValue('JSmith');
    component.RegistrationForm.controls.notes.setValue('Requesting account');
    component.RegistrationForm.controls.aup.setValue(true);
    component.realmName = 'test';
    component.register();

    expect(rs.createRegistration).toHaveBeenCalled();

    fixture.detectChanges();

    expect(component.registrationSuccess).toEqual(true);

    expect(fixture.debugElement.query(By.css('#regsuccess')).nativeElement.textContent).toContain(' You have successfully submitted a registration request!  The test administrators will now view and take action upon your request, and you will recieve an email detailing this action.  This process is not automated. ');

    expect(sb.open).not.toHaveBeenCalled();
  });

  it('registration not a success on http error', () => {
    spy = spyOn(sb, 'open');

    rs.createRegistration.and.returnValue(
      of<any>(
        {
          error: 'bad_request'
        }
      )
    );

    expect(fixture.debugElement.query(By.css('regsuccess'))).toBeNull();

    component.realmName = 'test';
    component.register();


    expect(rs.createRegistration).toHaveBeenCalled();
  });

  it('registration not a success on invalid inputs', () => {
    spy = spyOn(sb, 'open');

    rs.createRegistration.and.returnValue(throwError(
      {
        status: 400,
        error: {
          error: 'bad_request',
          errorDescription: 'Invalid registration request',
          globalErrors: [],
          fieldErrors: [
            {
              fieldName: 'registrationRequestDTO.requesterInfo.email',
              fieldError: 'Email is not available'
            },
            {
              fieldName: 'registrationRequestDTO.requesterInfo.username',
              fieldError: 'Username is not available'
            }
          ]
        }
      }
    )
    );

    expect(fixture.debugElement.query(By.css('regsuccess'))).toBeNull();

    component.realmName = 'test';
    component.register();


    expect(rs.createRegistration).toHaveBeenCalled();
    expect(component.RegistrationForm.get('email').getError('message')).toEqual('Email is not available');
    expect(component.RegistrationForm.get('username').getError('message')).toEqual('Username is not available');
    expect(sb.open).not.toHaveBeenCalled();

    rs.createRegistration.and.returnValue(throwError(
      {
        status: 400,
        error: {
          error: 'bad_request',
          errorDescription: 'Invalid registration request',
          globalErrors: [],
          fieldErrors: []
        }
      }
    ));

    component.register();

    expect(sb.open).toHaveBeenCalled();
  });

  it('fail snackbar shown with error in http request', () => {
    spy = spyOn(sb, 'open');

    const response = new HttpErrorResponse({ status: 500 });

    rs.createRegistration.and.returnValue(throwError(response));

    expect(fixture.debugElement.query(By.css('regsuccess'))).toBeNull();

    component.realmName = 'test';
    component.register();


    expect(rs.createRegistration).toHaveBeenCalled();
    expect(sb.open).toHaveBeenCalled();
  });

  it('snackbar open on fail to load realm data', () => {
    spy = spyOn(sb, 'open');
    realmService.getRealms.and.returnValue(throwError({}));
    fixture = TestBed.createComponent(RegistrationComponent);
    fixture.detectChanges();
    expect(sb.open).toHaveBeenCalled();
  });

  it('snackbar open on fail to load reg data', () => {
    spy = spyOn(sb, 'open');
    rs.getRegistrationConfig.and.returnValue(throwError({}));
    fixture = TestBed.createComponent(RegistrationComponent);
    fixture.detectChanges();
    expect(sb.open).toHaveBeenCalled();
  });

});
