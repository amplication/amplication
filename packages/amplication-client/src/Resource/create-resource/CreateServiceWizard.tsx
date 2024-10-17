import { Modal, Snackbar } from "@amplication/ui/design-system";
import * as H from "history";
import { kebabCase } from "lodash";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { match, useHistory } from "react-router-dom";
import usePlugins from "../../Plugins/hooks/usePlugins";
import { AppContext } from "../../context/appContext";
import { REACT_APP_PLUGIN_VERSION_USE_LATEST } from "../../env";
import * as models from "../../models";
import { AppRouteProps } from "../../routes/routesUtil";
import { useTracking } from "../../util/analytics";
import { AnalyticsEventNames } from "../../util/analytics-events.types";
import { expireCookie, getCookie } from "../../util/cookie";
import { formatError } from "../../util/error";
import {
  prepareServiceObject,
  prepareServiceTemplateObject,
} from "../constants";
import "./CreateServiceWizard.scss";
import ServiceWizard from "./ServiceWizard";
import CreateGenerationSettings from "./wizard-pages/CreateGenerationSettings";
import CreateGithubSync from "./wizard-pages/CreateGithubSync";
import CreateServiceAuth from "./wizard-pages/CreateServiceAuth";
import CreateServiceCodeGeneration from "./wizard-pages/CreateServiceCodeGeneration";
import CreateServiceDatabase from "./wizard-pages/CreateServiceDatabase";
import CreateServiceName from "./wizard-pages/CreateServiceName";
import { CreateServiceNextSteps } from "./wizard-pages/CreateServiceNextSteps";
import CreateServiceRepository from "./wizard-pages/CreateServiceRepository";
import CreateServiceTemplate from "./wizard-pages/CreateServiceTemplate";
import CreateServiceWelcome from "./wizard-pages/CreateServiceWelcome";
import { ResourceSettings } from "./wizard-pages/interfaces";
import {
  ResourceInitialValues,
  WizardProgressBarInterface,
  schemaArray,
  wizardProgressBarSchema,
} from "./wizardResourceSchema";

import useServiceTemplate from "../../ServiceTemplate/hooks/useServiceTemplate";
import { useProjectBaseUrl } from "../../util/useProjectBaseUrl";
import {
  FLOW_CREATE_SERVICE,
  FLOW_CREATE_SERVICE_TEMPLATE,
  FLOW_ONBOARDING,
  FLOW_SETTINGS,
} from "./constants";
import { WizardFlowType } from "./types";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
  }>;
  location: H.Location;
};

const pluginUseLatest = REACT_APP_PLUGIN_VERSION_USE_LATEST === "true";

const signupCookie = getCookie("signup");

const CreateServiceWizard: React.FC<Props> = ({
  moduleClass,
  innerRoutes,
  ...props
}) => {
  const isServiceTemplateFlow = props.match.path.endsWith(
    "/create-service-template"
  );

  const {
    errorCreateService,
    currentProject,
    loadingCreateService,
    setNewService,
    createServiceWithEntitiesResult: createResult,
    addBlock,
  } = useContext(AppContext);
  const { baseUrl } = useProjectBaseUrl();

  const {
    createServiceTemplate,
    loadingCreateServiceTemplate,
    errorCreateServiceTemplate,
    createdServiceTemplateResults,
  } = useServiceTemplate(currentProject, (ServiceTemplate) => {
    addBlock(ServiceTemplate.id);
  });

  const { trackEvent } = useTracking();
  const history = useHistory();
  const [currentBuild, setCurrentBuild] = useState<models.Build>(
    createResult?.build || null
  );

  const [currentCodeGenerator, setCurrentCodeGenerator] =
    useState<models.EnumCodeGenerator>(models.EnumCodeGenerator.NodeJs);

  const { pluginCatalog } = usePlugins(null, null, currentCodeGenerator);

  const isSignupUser = signupCookie === "1";

  const wizardFlow: WizardFlowType = isServiceTemplateFlow
    ? FLOW_CREATE_SERVICE_TEMPLATE
    : isSignupUser
    ? FLOW_ONBOARDING
    : FLOW_CREATE_SERVICE;

  const flowSettings = FLOW_SETTINGS[wizardFlow];

  const errorMessage = formatError(
    errorCreateService || errorCreateServiceTemplate
  );
  const setWizardProgressItems = useCallback(() => {
    const pagesMap = {};
    return flowSettings.pattern.reduce(
      (wizardArr: WizardProgressBarInterface[], page: number) => {
        const findPage = wizardProgressBarSchema.find(
          (item: WizardProgressBarInterface) => item.activePages.includes(page)
        );
        if (!findPage) return wizardArr;

        if (pagesMap[findPage.title]) return wizardArr;

        pagesMap[findPage.title] = { ...findPage, pageIndex: page };
        wizardArr.push(findPage);

        return wizardArr;
      },
      []
    );
  }, [flowSettings]);

  useEffect(() => {
    if (createResult?.build) setCurrentBuild(createResult?.build);
  }, [createResult?.build]);

  const handleRebuildClick = useCallback((build: models.Build) => {
    setCurrentBuild(build);
  }, []);

  const createResourcePlugins = useCallback(
    (pluginIds: string[]): models.PluginInstallationsCreateInput => {
      const data: models.PluginInstallationsCreateInput = {
        plugins: [],
      };

      data.plugins = pluginIds
        .map((pluginId) => {
          const plugin = pluginCatalog[pluginId];
          if (!plugin) return null;
          const pluginVersion = pluginUseLatest
            ? plugin?.versions.find((x) => x.isLatest)
            : plugin?.versions[0];

          return {
            displayName: plugin.name,
            pluginId: plugin.pluginId,
            enabled: true,
            npm: plugin.npm,
            version: "latest",
            resource: { connect: { id: "" } },
            settings: pluginVersion?.settings || JSON.parse("{}"),
            configurations: pluginVersion?.configurations || JSON.parse("{}"),
            isPrivate: false,
          };
        })
        .filter((x) => x !== null);

      return data;
    },
    [pluginCatalog]
  );

  const trackWizardPageEvent = useCallback(
    (
      eventName: AnalyticsEventNames,
      additionalData?: { [key: string]: string }
    ) => {
      trackEvent({
        eventName,
        category: "Service Wizard",
        WizardType: wizardFlow,
        ...additionalData,
      });
    },
    [trackEvent, wizardFlow]
  );

  const handleCloseWizard = useCallback(
    (currentPage: string) => {
      trackWizardPageEvent(AnalyticsEventNames.ServiceWizardStep_CloseClick, {
        step: currentPage,
      });
      history.push(`${baseUrl}`);
    },
    [trackWizardPageEvent, history, baseUrl]
  );

  const handleWizardProgress = useCallback(
    (
      eventName:
        | AnalyticsEventNames.ServiceWizardStep_ContinueClicked
        | AnalyticsEventNames.ServiceWizardStep_BackClicked,
      page: string,
      pageEventName: AnalyticsEventNames
    ) => {
      trackWizardPageEvent(eventName, { step: page });
      trackWizardPageEvent(pageEventName);
    },
    [trackWizardPageEvent]
  );

  const createResource = useCallback(
    (activeIndex: number, values: ResourceSettings) => {
      if (activeIndex !== flowSettings.submitFormIndex) {
        return;
      }

      const {
        serviceName,
        generateAdminUI,
        generateGraphQL,
        generateRestApi,
        gitOrganizationId,
        gitRepositoryName,
        groupName,
        isOverrideGitRepository,
        authType,
        databaseType,
        structureType,
        baseDir,
        connectToDemoRepo,
        codeGenerator,
      } = values;

      const kebabCaseServiceName = kebabCase(serviceName);

      const serverDir = isServiceTemplateFlow
        ? `${baseDir}/{{SERVICE_NAME}}`
        : structureType === "Mono"
        ? `${baseDir}/${kebabCaseServiceName}`
        : "";
      const adminDir = isServiceTemplateFlow
        ? `${baseDir}/{{SERVICE_NAME}}-admin`
        : structureType === "Mono"
        ? `${baseDir}/${kebabCaseServiceName}-admin`
        : "";

      if (currentProject) {
        const pluginIds: string[] = [databaseType];
        if (authType && authType !== "no") {
          pluginIds.push(authType);
          if (codeGenerator === models.EnumCodeGenerator.NodeJs) {
            pluginIds.push("auth-core");
          }
        }
        const plugins = createResourcePlugins(pluginIds);
        let currentGitRepository: models.ConnectGitRepositoryInput = null;
        if (gitRepositoryName) {
          currentGitRepository = {
            name: gitRepositoryName,
            gitOrganizationId: gitOrganizationId,
            groupName,
            resourceId: "",
            isOverrideGitRepository: isOverrideGitRepository,
          };
        }

        if (isServiceTemplateFlow) {
          const serviceTemplateCreateInput = prepareServiceTemplateObject(
            serviceName,
            currentProject?.id,
            generateAdminUI,
            generateGraphQL,
            generateRestApi,
            serverDir,
            adminDir,
            plugins,
            codeGenerator
          );
          createServiceTemplate(serviceTemplateCreateInput);
        } else {
          const resourceCreateInput = prepareServiceObject(
            serviceName,
            currentProject?.id,
            generateAdminUI,
            generateGraphQL,
            generateRestApi,
            currentGitRepository,
            serverDir,
            adminDir,
            plugins,
            wizardFlow,
            structureType,
            databaseType,
            authType,
            connectToDemoRepo,
            codeGenerator
          );

          setNewService(
            resourceCreateInput,
            AnalyticsEventNames.ResourceFromScratchCreate
          );
        }
      }
      expireCookie("signup");
    },
    [
      createResourcePlugins,
      createServiceTemplate,
      currentProject,
      isServiceTemplateFlow,
      setNewService,
      wizardFlow,
    ]
  );

  return (
    <Modal open fullScreen css={moduleClass}>
      <ServiceWizard
        wizardSteps={flowSettings.steps}
        wizardProgressBar={setWizardProgressItems()}
        wizardSchema={schemaArray}
        wizardInitialValues={ResourceInitialValues}
        wizardSubmit={createResource}
        moduleCss={moduleClass}
        submitFormPage={flowSettings.submitFormIndex}
        submitLoader={loadingCreateService || loadingCreateServiceTemplate}
        handleCloseWizard={handleCloseWizard}
        handleWizardProgress={handleWizardProgress}
        wizardFlowType={wizardFlow}
        flowSettings={flowSettings}
      >
        <CreateServiceWelcome
          moduleClass={moduleClass}
          trackWizardPageEvent={trackWizardPageEvent}
          flowSettings={flowSettings}
        />
        <CreateServiceName
          moduleClass={moduleClass}
          trackWizardPageEvent={trackWizardPageEvent}
          setCurrentCodeGenerator={setCurrentCodeGenerator}
          flowSettings={flowSettings}
        />
        <CreateGithubSync
          moduleClass={moduleClass}
          trackWizardPageEvent={trackWizardPageEvent}
          wizardFlowType={wizardFlow}
          flowSettings={flowSettings}
        />
        <CreateGenerationSettings
          moduleClass={moduleClass}
          trackWizardPageEvent={trackWizardPageEvent}
          flowSettings={flowSettings}
        />
        <CreateServiceRepository
          moduleClass={moduleClass}
          trackWizardPageEvent={trackWizardPageEvent}
          flowSettings={flowSettings}
        />
        <CreateServiceDatabase
          moduleClass={moduleClass}
          trackWizardPageEvent={trackWizardPageEvent}
          pluginCatalog={pluginCatalog}
          flowSettings={flowSettings}
        />
        <CreateServiceTemplate
          moduleClass={moduleClass}
          trackWizardPageEvent={trackWizardPageEvent}
          flowSettings={flowSettings}
        />

        <CreateServiceAuth
          moduleClass={moduleClass}
          trackWizardPageEvent={trackWizardPageEvent}
          pluginCatalog={pluginCatalog}
          flowSettings={flowSettings}
        />
        <CreateServiceCodeGeneration
          moduleClass="create-service-code-generation"
          resource={createResult?.resource}
          build={currentBuild}
          trackWizardPageEvent={trackWizardPageEvent}
          rebuildClick={handleRebuildClick}
          flowSettings={flowSettings}
        />
        <CreateServiceNextSteps
          moduleClass={moduleClass}
          trackWizardPageEvent={trackWizardPageEvent}
          flowSettings={flowSettings}
          wizardFlowType={wizardFlow}
          createdResource={
            wizardFlow === FLOW_CREATE_SERVICE_TEMPLATE
              ? createdServiceTemplateResults?.createServiceTemplate
              : createResult?.resource
          }
        />
      </ServiceWizard>
      <Snackbar
        open={
          Boolean(errorCreateService) || Boolean(errorCreateServiceTemplate)
        }
        message={errorMessage}
      />
    </Modal>
  );
};

export default CreateServiceWizard;
