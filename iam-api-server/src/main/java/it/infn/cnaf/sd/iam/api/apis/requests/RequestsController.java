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
package it.infn.cnaf.sd.iam.api.apis.requests;

import static java.util.stream.Collectors.toList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import it.infn.cnaf.sd.iam.api.apis.registrations.RegistrationRequestMapper;
import it.infn.cnaf.sd.iam.api.apis.registrations.dto.RegistrationRequestDTO;
import it.infn.cnaf.sd.iam.api.common.dto.ListResponseDTO;
import it.infn.cnaf.sd.iam.api.common.utils.PageUtils;
import it.infn.cnaf.sd.iam.persistence.entity.RegistrationRequestEntity;

@RestController
@RequestMapping(value = "/Realms/{realm}")
@Transactional
@PreAuthorize("hasRole('IAM_OWNER')")
public class RequestsController {

  public static final int PAGE_SIZE = 20;

  final RequestsService service;
  final RegistrationRequestMapper mapper;

  @Autowired
  public RequestsController(RequestsService service, RegistrationRequestMapper mapper) {
    this.service = service;
    this.mapper = mapper;
  }

  @GetMapping("/Requests/registration/pending")
  ListResponseDTO<RegistrationRequestDTO> getPendingRegistrationRequests(
      @RequestParam(required = false) final Integer count,
      @RequestParam(required = false) final Integer startIndex) {

    PageRequest pageRequest = PageUtils.buildPageRequest(count, startIndex, PAGE_SIZE,
        Sort.by("metadata.creationTime").descending());

    Page<RegistrationRequestEntity> pendingRequests = service.getPendingRequests(pageRequest);
    ListResponseDTO.Builder<RegistrationRequestDTO> result = ListResponseDTO.builder();
    result.fromPage(pendingRequests);

    result.resources(pendingRequests.get().map(mapper::entityToDto).collect(toList()));
    return result.build();
  }
  



}
