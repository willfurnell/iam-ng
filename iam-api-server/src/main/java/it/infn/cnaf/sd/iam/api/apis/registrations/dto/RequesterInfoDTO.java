/**
 * Copyright (c) Istituto Nazionale di Fisica Nucleare (INFN). 2016-2020
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package it.infn.cnaf.sd.iam.api.apis.registrations.dto;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import it.infn.cnaf.sd.iam.api.apis.registrations.validator.EmailAvailable;
import it.infn.cnaf.sd.iam.api.apis.registrations.validator.UsernameAvailable;

public class RequesterInfoDTO {
  
 public static final String USERNAME_REGEXP = "^[a-z_]([a-z0-9_-]{0,31}|[a-z0-9_-]{0,30}\\$)$";
  
  public static final String NO_SPECIAL_CHARACTERS_REGEXP = "^[^<>%$]*$";

  @Pattern(regexp = USERNAME_REGEXP,
      message = "invalid username (does not match with regexp: '" + USERNAME_REGEXP + "')")
  @UsernameAvailable
  private String username;
  
  @Pattern(regexp = NO_SPECIAL_CHARACTERS_REGEXP,
      message = "name contains invalid characters")
  private String givenName;
  
  @Pattern(regexp = NO_SPECIAL_CHARACTERS_REGEXP,
      message = "family name contains invalid characters")
  private String familyName;
  
  @Email(message = "value provided is not a valid email address")
  @NotBlank(message = "email cannot be blank")
  @NotNull(message = "email cannot be null")
  @Size(max = 128, message = "email too long")
  @EmailAvailable
  private String email;

  private boolean emailVerified;

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getGivenName() {
    return givenName;
  }

  public void setGivenName(String givenName) {
    this.givenName = givenName;
  }

  public String getFamilyName() {
    return familyName;
  }

  public void setFamilyName(String familyName) {
    this.familyName = familyName;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public boolean isEmailVerified() {
    return emailVerified;
  }

  public void setEmailVerified(boolean emailVerified) {
    this.emailVerified = emailVerified;
  }
}
