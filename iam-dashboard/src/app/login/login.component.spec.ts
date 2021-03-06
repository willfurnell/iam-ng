import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { AppConfigService } from '../app-config.service';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let appConfigService;

  beforeEach(async(() => {

    appConfigService = jasmine.createSpyObj(['getIamApiBaseUrl', 'attributeExists', 'getCustomAttribute']);
    appConfigService.getIamApiBaseUrl.and.returnValue('');
    appConfigService.attributeExists.and.returnValue(true);

    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatCardModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule
      ],
      declarations: [ LoginComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: {
          paramMap: of(
            convertToParamMap(of(
              {
                realm: 'alice'
              }
            ))
          )
        }},
        { provide: AppConfigService, useValue: appConfigService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('attributeExists should return true', () => {
    appConfigService.attributeExists.and.returnValue(true);
    expect(component.attributeExists('anything')).toBeTrue();
  });


  it('attributeExists should return false', () => {
    appConfigService.attributeExists.and.returnValue(false);
    expect(component.attributeExists('anything')).toBeFalse();
  });

  it('getCustomAttribute should return blank', () => {
    appConfigService.getCustomAttribute.and.returnValue('');
    expect(component.getCustomAttribute('anything')).toEqual('');
  });

});
