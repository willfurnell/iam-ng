package it.infn.cnaf.sd.iam.api.apis.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import it.infn.cnaf.sd.iam.api.apis.configuration.dto.RealmConfigurationDTO;
import it.infn.cnaf.sd.iam.api.apis.error.ErrorUtils;
import it.infn.cnaf.sd.iam.api.common.utils.ValidationHelper;

@RestController
@RequestMapping(value = "/Realms/{realm}")
@PreAuthorize("hasRole('IAM_OWNER')")
public class ConfigurationController implements ErrorUtils {

  public static final String INVALID_CONFIGURATION = "Invalid configuration";

  private final RealmConfigurationService service;

  @Autowired
  public ConfigurationController(RealmConfigurationService service) {
    this.service = service;
  }

  @GetMapping("/Configuration")
  public RealmConfigurationDTO getConfiguration() {
    return service.getRealmConfiguration();
  }

  @PutMapping("/Configuration")
  public RealmConfigurationDTO setConfiguration(
      @RequestBody @Validated final RealmConfigurationDTO config,
      final BindingResult validationResult) {
    ValidationHelper.handleValidationError(INVALID_CONFIGURATION, validationResult);

    service.saveRealmConfiguration(config);
    return config;
  }
}
