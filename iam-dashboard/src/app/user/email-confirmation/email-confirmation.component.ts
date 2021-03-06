import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RegistrationService } from '../registration/registration.service';
import { RegistrationConfigurationDTO } from '../../models/registration-configuration-dto';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.scss']
})
export class EmailConfirmationComponent implements OnInit {

  realmName = '';
  token = '';
  message = '';
  detail = '';

  registrationConfiguration: RegistrationConfigurationDTO = {
    kind: '',
    registrationEnabled: true,
    privacyPolicyUrl: '',
    aupUrl: '',
    logoUrl: ''
  };

  constructor(private route: ActivatedRoute, private registrationService: RegistrationService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      this.realmName = paramMap.get('realm');
      this.token = paramMap.get('token');
    });

    this.registrationService.confirmEmail(this.token, this.realmName).subscribe(
      (response) => {
        if (response.error) {
          this.message = 'Error';
          this.detail = response.errorDescription;
        } else if (response.message) {
          this.message = response.message;
          this.detail = response.detail;
        }
      },

      (error) => {
        this.message = 'Error';
        if (error.status === 404) {
          // We get a 404 error when the token isn't found
          this.detail = error.error.errorDescription;
        } else {
          this.detail = 'There was an error when making your registration request, please try and reload the page.';
        }
      }
    );

    this.registrationService.getRegistrationConfig(this.realmName).subscribe(
      (response) => {
        this.registrationConfiguration = response;
      }
    );

  }

}
