import { WizardFlowSettings, WizardFlowType } from "./types";
import {
  CREATE_SERVICE_PATTERN,
  CREATE_SERVICE_STEPS,
} from "./wizard-types/wizard-type-create-service";
import {
  CREATE_SERVICE_TEMPLATE_PATTERN,
  CREATE_SERVICE_TEMPLATE_STEPS,
} from "./wizard-types/wizard-type-create-service-template";
import {
  ONBOARDING_PATTERN,
  ONBOARDING_STEPS,
} from "./wizard-types/wizard-type-onboarding";

export const FLOW_ONBOARDING = "Onboarding";
export const FLOW_CREATE_SERVICE = "Create Service";
export const FLOW_CREATE_SERVICE_TEMPLATE = "Create Service Template";

export const FLOW_SETTINGS: {
  [key in WizardFlowType]: WizardFlowSettings;
} = {
  [FLOW_ONBOARDING]: {
    steps: ONBOARDING_STEPS,
    pattern: ONBOARDING_PATTERN,
    submitFormIndex: 7,
    texts: {},
  },
  [FLOW_CREATE_SERVICE]: {
    steps: CREATE_SERVICE_STEPS,
    pattern: CREATE_SERVICE_PATTERN,
    submitFormIndex: 7,
    texts: {},
  },
  [FLOW_CREATE_SERVICE_TEMPLATE]: {
    steps: CREATE_SERVICE_TEMPLATE_STEPS,
    pattern: CREATE_SERVICE_TEMPLATE_PATTERN,
    submitFormIndex: 5,
    texts: {
      chooseName: "First, we need to choose a name for the service template",
      chooseNameDescription: `Give your template a meaningful name. For example, ".NET with MSSQL and REST API"`,
      chooseNameField: "Template name",
      chooseNameFieldPlaceholder: ".NET with MSSQL and REST API",
      apisTitle: "How would you like to structure your service template?",
      apisDescription:
        "Do you want it to include a GraphQL API, REST API, or both? Also, select whether you want to generate the Admin UI for your templated service, with forms to create, update, and delete data.",
      successTitle: "Your template was created successfully! 🎉",
      successEntitiesLine1: "Add entities to",
      successEntitiesLine2: "the service template",
      successPluginsLine1: "Add plugins to",
      successPluginsLine2: "the service template",
      successDoneLine1: "I'm done!",
      successDoneLine2: "View my templates",
      successLoading: "All set! We’re currently creating your template.",
    },
  },
};
