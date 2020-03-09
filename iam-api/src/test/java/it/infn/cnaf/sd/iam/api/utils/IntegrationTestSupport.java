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
package it.infn.cnaf.sd.iam.api.utils;

import java.util.function.Supplier;

import org.junit.Before;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;

import it.infn.cnaf.sd.iam.api.common.realm.RealmContext;

public abstract class IntegrationTestSupport {

  @Autowired
  protected MockMvc mvc;

  @Autowired
  protected ObjectMapper mapper;

  @Before
  public void setup() {
    RealmContext.clear();
  }

  protected Supplier<AssertionError> assertionError(String message) {
    return () -> new AssertionError(message);
  }
}
