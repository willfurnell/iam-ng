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
package it.infn.cnaf.sd.iam.api.config;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManagerResolver;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.oauth2.provider.error.OAuth2AuthenticationEntryPoint;

@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class ApiSecurityConfig extends WebSecurityConfigurerAdapter {

  public static final String REALMS_RESOURCE = "/Realms";
  public static final String REGISTRATIONS_RESOURCE = "/Realms/*/Registrations";
  public static final Logger LOG = LoggerFactory.getLogger(ApiSecurityConfig.class);

  @Autowired
  AuthenticationManagerResolver<HttpServletRequest> authenticationManagerResolver;

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    // @formatter:off
    http
       .requestMatchers()
         .mvcMatchers("/Realms/**")
         .and()
           .oauth2ResourceServer()
           .authenticationEntryPoint(new OAuth2AuthenticationEntryPoint())
           .authenticationManagerResolver(authenticationManagerResolver)
         .and()
           .anonymous()
         .and()
           .cors()
         .and()
           .authorizeRequests()
             .mvcMatchers(HttpMethod.POST,REGISTRATIONS_RESOURCE).permitAll()
             .mvcMatchers(HttpMethod.POST,REGISTRATIONS_RESOURCE+"/confirm/*").permitAll()
             .mvcMatchers(HttpMethod.GET,REGISTRATIONS_RESOURCE+"/config").permitAll()
             .mvcMatchers(HttpMethod.GET,REALMS_RESOURCE).permitAll()
             .mvcMatchers(HttpMethod.HEAD,REALMS_RESOURCE).permitAll()
             .mvcMatchers(HttpMethod.OPTIONS,REALMS_RESOURCE).permitAll()
             .anyRequest().fullyAuthenticated()
         .and()
           .csrf().disable();
         
    // @formatter:on
  }
}
