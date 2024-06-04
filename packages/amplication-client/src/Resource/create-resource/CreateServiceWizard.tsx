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
import { prepareServiceObject } from "../constants";
import "./CreateServiceWizard.scss";
import ServiceWizard, { WizardStep } from "./ServiceWizard";
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
  templateMapping,
  wizardProgressBarSchema,
} from "./wizardResourceSchema";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
  }>;
  location: H.Location;
};

const FLOW_ONBOARDING = "Onboarding";
const FLOW_CREATE_SERVICE = "Create Service";
const pluginUseLatest = REACT_APP_PLUGIN_VERSION_USE_LATEST === "true";

export type DefineUser = "Onboarding" | "Create Service";

const ONBOARDING_STEPS: WizardStep[] = [
  {
    index: 0,
    hideFooter: true,
    hideBackButton: true,
    analyticsEventName: AnalyticsEventNames.ViewServiceWizardStep_Welcome,
    stepName: "CreateServiceWelcome",
  },
  {
    index: 1,
    hideBackButton: true,
    analyticsEventName: AnalyticsEventNames.ViewServiceWizardStep_Name,
    stepName: "CreateServiceName",
  },
  {
    index: 2,
    analyticsEventName: AnalyticsEventNames.ViewServiceWizardStep_Git,
    stepName: "CreateGithubSync",
  },
  {
    index: 3,
    analyticsEventName: AnalyticsEventNames.ViewServiceWizardStep_APISettings,
    stepName: "CreateGenerationSettings",
  },
  {
    index: 4,
    analyticsEventName: AnalyticsEventNames.ViewServiceWizardStep_RepoSettings,
    stepName: "CreateServiceRepository",
  },
  {
    index: 5,
    analyticsEventName: AnalyticsEventNames.ViewServiceWizardStep_DBSettings,
    stepName: "CreateServiceDatabase",
  },
  {
    index: 6,
    analyticsEventName:
      AnalyticsEventNames.ViewServiceWizardStep_EntitiesSettings,
    stepName: "CreateServiceTemplate",
  },
  {
    index: 7,
    analyticsEventName: AnalyticsEventNames.ViewServiceWizardStep_AuthSettings,
    stepName: "CreateServiceAuth",
  },
  {
    index: 8,
    hideBackButton: true,
    analyticsEventName:
      AnalyticsEventNames.ViewServiceWizardStep_CodeGeneration,
    stepName: "CreateServiceCodeGeneration",
  },
  {
    index: 9,
    hideBackButton: true,
    analyticsEventName: AnalyticsEventNames.ViewServiceWizardStep_Finish,
    stepName: "CreateServiceNextSteps",
  },
];

const ONBOARDING_PATTERN = ONBOARDING_STEPS.map((step) => step.index);

const CREATE_SERVICE_STEPS: WizardStep[] = [
  {
    index: 1,
    hideBackButton: true,
    analyticsEventName: AnalyticsEventNames.ViewServiceWizardStep_Name,
    stepName: "CreateServiceName",
  },
  {
    index: 2,
    analyticsEventName: AnalyticsEventNames.ViewServiceWizardStep_Git,
    stepName: "CreateGithubSync",
  },
  {
    index: 3,
    analyticsEventName: AnalyticsEventNames.ViewServiceWizardStep_APISettings,
    stepName: "CreateGenerationSettings",
  },
  {
    index: 4,
    analyticsEventName: AnalyticsEventNames.ViewServiceWizardStep_RepoSettings,
    stepName: "CreateServiceRepository",
  },
  {
    index: 5,
    analyticsEventName: AnalyticsEventNames.ViewServiceWizardStep_DBSettings,
    stepName: "CreateServiceDatabase",
  },
  {
    index: 7,
    analyticsEventName: AnalyticsEventNames.ViewServiceWizardStep_AuthSettings,
    stepName: "CreateServiceAuth",
  },
  {
    index: 9,
    hideBackButton: true,
    analyticsEventName: AnalyticsEventNames.ViewServiceWizardStep_Finish,
    stepName: "CreateServiceNextSteps",
  },
];

const CREATE_SERVICE_PATTERN = CREATE_SERVICE_STEPS.map((step) => step.index);

const signupCookie = getCookie("signup");

const CreateServiceWizard: React.FC<Props> = ({
  moduleClass,
  innerRoutes,
  ...props
}) => {
  const {
    errorCreateService,
    currentProject,
    currentWorkspace,
    loadingCreateService,
    setNewService,
    createServiceWithEntitiesResult: createResult,
  } = useContext(AppContext);

  const { trackEvent } = useTracking();
  const history = useHistory();
  const [currentBuild, setCurrentBuild] = useState<models.Build>(
    createResult?.build || null
  );

  const [currentCodeGenerator, setCurrentCodeGenerator] =
    useState<models.EnumCodeGenerator>(models.EnumCodeGenerator.NodeJs);

  const { pluginCatalog } = usePlugins(null, null, currentCodeGenerator);

  const isSignupUser = signupCookie === "1";

  const defineUser: DefineUser = isSignupUser
    ? FLOW_ONBOARDING
    : FLOW_CREATE_SERVICE;

  const wizardSteps =
    defineUser === FLOW_CREATE_SERVICE
      ? CREATE_SERVICE_STEPS
      : ONBOARDING_STEPS;

  const wizardPattern =
    defineUser === FLOW_CREATE_SERVICE
      ? CREATE_SERVICE_PATTERN
      : ONBOARDING_PATTERN;

  const serviceNextStepStatus = {
    description: isSignupUser
      ? ["Invite", "my team"]
      : ["Add plugins", "to my service"],
    defineUser,
    icon: isSignupUser ? "users" : "plugins",
    iconBackgroundColor: isSignupUser ? "#8DD9B9" : "#f85b6e",
    eventActionName: isSignupUser ? "Invite Team" : "Add Plugins",
  };

  const errorMessage = formatError(errorCreateService);
  const setWizardProgressItems = useCallback(() => {
    const pagesMap = {};
    return wizardPattern.reduce(
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
  }, [wizardPattern]);

  useEffect(() => {
    if (createResult?.build) setCurrentBuild(createResult?.build);
  }, [createResult?.build]);

  const handleRebuildClick = useCallback(
    (build: models.Build) => {
      setCurrentBuild(build);
    },
    [currentBuild]
  );

  const createStarterResource = useCallback(
    (data: models.ResourceCreateWithEntitiesInput, eventName: string) => {
      setNewService(data, eventName);
    },
    [setNewService]
  );

  const createResourcePlugins = useCallback(
    (pluginIds: string[]): models.PluginInstallationsCreateInput => {
      const data: models.PluginInstallationsCreateInput = {
        plugins: [],
      };

      data.plugins = pluginIds.map((pluginId) => {
        const plugin = pluginCatalog[pluginId];

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
        };
      });

      return data;
    },
    [pluginCatalog]
  );

  const handleCloseWizard = useCallback(
    (currentPage: string) => {
      trackWizardPageEvent(AnalyticsEventNames.ServiceWizardStep_CloseClick, {
        step: currentPage,
      });
      history.push(`/${currentWorkspace.id}/${currentProject.id}`);
    },
    [currentWorkspace, currentProject]
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
    []
  );

  const trackWizardPageEvent = useCallback(
    (
      eventName: AnalyticsEventNames,
      additionalData?: { [key: string]: string }
    ) => {
      trackEvent({
        eventName,
        category: "Service Wizard",
        WizardType: defineUser,
        ...additionalData,
      });
    },
    []
  );

  const createResource = useCallback(
    (activeIndex: number, values: ResourceSettings) => {
      if (activeIndex < 6) return;
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
        templateType,
        structureType,
        baseDir,
        connectToDemoRepo,
        codeGenerator,
      } = values;

      const kebabCaseServiceName = kebabCase(serviceName);

      const serverDir =
        structureType === "Mono" ? `${baseDir}/${kebabCaseServiceName}` : "";
      const adminDir =
        structureType === "Mono"
          ? `${baseDir}/${kebabCaseServiceName}-admin`
          : "";
      const templateSettings = templateMapping[templateType];

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

        const resource = prepareServiceObject(
          serviceName,
          currentProject?.id,
          templateSettings,
          generateAdminUI,
          generateGraphQL,
          generateRestApi,
          currentGitRepository,
          serverDir,
          adminDir,
          plugins,
          defineUser,
          structureType,
          databaseType,
          authType,
          connectToDemoRepo,
          codeGenerator
        );
        createStarterResource(resource, templateSettings.eventName);
      }
      expireCookie("signup");
    },
    [createResourcePlugins, createStarterResource, currentProject, defineUser]
  );

  return (
    <Modal open fullScreen css={moduleClass}>
      <ServiceWizard
        wizardSteps={wizardSteps}
        wizardProgressBar={setWizardProgressItems()}
        wizardSchema={schemaArray}
        wizardInitialValues={ResourceInitialValues}
        wizardSubmit={createResource}
        moduleCss={moduleClass}
        submitFormPage={7}
        submitLoader={loadingCreateService}
        handleCloseWizard={handleCloseWizard}
        handleWizardProgress={handleWizardProgress}
        defineUser={defineUser}
      >
        <CreateServiceWelcome
          moduleClass={moduleClass}
          trackWizardPageEvent={trackWizardPageEvent}
        />
        <CreateServiceName
          moduleClass={moduleClass}
          trackWizardPageEvent={trackWizardPageEvent}
          setCurrentCodeGenerator={setCurrentCodeGenerator}
        />
        <CreateGithubSync
          moduleClass={moduleClass}
          trackWizardPageEvent={trackWizardPageEvent}
          defineUser={defineUser}
        />
        <CreateGenerationSettings
          moduleClass={moduleClass}
          trackWizardPageEvent={trackWizardPageEvent}
        />
        <CreateServiceRepository
          moduleClass={moduleClass}
          trackWizardPageEvent={trackWizardPageEvent}
        />
        <CreateServiceDatabase
          // PostgresPng={PostgresPng}
          // MongoPng={MongoPng}
          // MysqlPng={MysqlPng}
          // MsSqlPng={MsSqlPng}
          moduleClass={moduleClass}
          trackWizardPageEvent={trackWizardPageEvent}
          pluginCatalog={pluginCatalog}
        />
        <CreateServiceTemplate
          moduleClass={moduleClass}
          trackWizardPageEvent={trackWizardPageEvent}
        />

        <CreateServiceAuth
          moduleClass={moduleClass}
          trackWizardPageEvent={trackWizardPageEvent}
          pluginCatalog={pluginCatalog}
        />
        <CreateServiceCodeGeneration
          moduleClass="create-service-code-generation"
          resource={createResult?.resource}
          build={currentBuild}
          trackWizardPageEvent={trackWizardPageEvent}
          rebuildClick={handleRebuildClick}
        />
        <CreateServiceNextSteps
          moduleClass={moduleClass}
          trackWizardPageEvent={trackWizardPageEvent}
          {...serviceNextStepStatus}
        />
      </ServiceWizard>
      <Snackbar open={Boolean(errorCreateService)} message={errorMessage} />
    </Modal>
  );
};

export default CreateServiceWizard;
