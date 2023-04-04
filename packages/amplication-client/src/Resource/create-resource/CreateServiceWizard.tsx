import { Modal, Snackbar } from "@amplication/ui/design-system";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { match, useHistory } from "react-router-dom";
import * as H from "history";
import { formatError } from "../../util/error";
import "./CreateServiceWizard.scss";
import { AppRouteProps } from "../../routes/routesUtil";
import { AppContext } from "../../context/appContext";
import ServiceWizard from "./ServiceWizard";
import CreateServiceName from "./wizard-pages/CreateServiceName";
import CreateGithubSync from "./wizard-pages/CreateGithubSync";
import CreateGenerationSettings from "./wizard-pages/CreateGenerationSettings";
import CreateServiceRepository from "./wizard-pages/CreateServiceRepository";
import CreateServiceDatabase from "./wizard-pages/CreateServiceDatabase";
import CreateServiceAuth from "./wizard-pages/CreateServiceAuth";
import {
  schemaArray,
  ResourceInitialValues,
  WizardProgressBarInterface,
  wizardProgressBarSchema,
  templateMapping,
} from "./wizardResourceSchema";
import { ResourceSettings } from "./wizard-pages/interfaces";
import CreateServiceCodeGeneration from "./wizard-pages/CreateServiceCodeGeneration";
import { CreateServiceNextSteps } from "./wizard-pages/CreateServiceNextSteps";
import { prepareServiceObject } from "../constants";
import * as models from "../../models";
import { AnalyticsEventNames } from "../../util/analytics-events.types";
import { useTracking } from "../../util/analytics";
import { expireCookie, getCookie } from "../../util/cookie";
import CreateServiceTemplate from "./wizard-pages/CreateServiceTemplate";
import { kebabCase } from "lodash";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
  }>;
  location: H.Location;
};

export type DefineUser = "Onboarding" | "Create Service";

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

  const defineUser: DefineUser =
    signupCookie === "1" ? "Onboarding" : "Create Service";
  const wizardPattern =
    defineUser === "Create Service"
      ? [0, 1, 2, 3, 4, 5, 6, 8]
      : [0, 1, 2, 3, 4, 5, 6, 7, 8];
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
    (
      databaseType: "postgres" | "mysql" | "mongo",
      authType: string
    ): models.PluginInstallationsCreateInput => {
      const authCorePlugins = authType === "core" && [
        {
          displayName: "Auth-core",
          pluginId: "auth-core",
          enabled: true,
          npm: "@amplication/plugin-auth-core",
          version: "latest",
          resource: { connect: { id: "" } },
        },
        {
          displayName: "Auth-jwt",
          pluginId: "auth-jwt",
          enabled: true,
          npm: "@amplication/plugin-auth-jwt",
          version: "latest",
          resource: { connect: { id: "" } },
        },
      ];

      const data: models.PluginInstallationsCreateInput = {
        plugins: [
          {
            displayName: databaseType,
            pluginId: `db-${databaseType}`,
            enabled: true,
            npm: `@amplication/plugin-db-${databaseType}`,
            version: "latest",
            resource: { connect: { id: "" } },
          },
        ],
      };

      if (authCorePlugins) data.plugins.push(...authCorePlugins);
      return data;
    },
    []
  );

  const handleCloseWizard = useCallback(
    (currentPage: string) => {
      history.push(`/${currentWorkspace.id}/${currentProject.id}`);
    },
    [currentWorkspace, currentProject]
  );

  const handleWizardProgress = useCallback(
    (dir: "next" | "prev", page: string) => {
      trackEvent({
        eventName:
          AnalyticsEventNames[
            dir === "next"
              ? "ServiceWizardStep_ContinueClick"
              : "ServiceWizardStep_BackClick"
          ],
        category: "Service Wizard",
        WizardType: defineUser,
        step: page,
      });
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
        isOverrideGitRepository,
        authType,
        databaseType,
        templateType,
        structureType,
        baseDir,
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
        const plugins = createResourcePlugins(databaseType, authType);
        const resource = prepareServiceObject(
          serviceName,
          currentProject?.id,
          templateSettings,
          generateAdminUI,
          generateGraphQL,
          generateRestApi,
          {
            name: gitRepositoryName,
            gitOrganizationId: gitOrganizationId,
            resourceId: "",
            isOverrideGitRepository: isOverrideGitRepository,
          },
          serverDir,
          adminDir,
          plugins,
          defineUser,
          structureType,
          databaseType,
          authType
          // gitOrganizationName
        );

        createStarterResource(resource, templateSettings.eventName);
      }
      expireCookie("signup");
    },
    []
  );

  return (
    <Modal open fullScreen css={moduleClass}>
      <ServiceWizard
        wizardPattern={wizardPattern}
        wizardProgressBar={setWizardProgressItems()}
        wizardSchema={schemaArray}
        wizardInitialValues={ResourceInitialValues}
        wizardSubmit={createResource}
        moduleCss={moduleClass}
        submitFormPage={6}
        submitLoader={loadingCreateService}
        handleCloseWizard={handleCloseWizard}
        handleWizardProgress={handleWizardProgress}
      >
        <CreateServiceName
          moduleClass={moduleClass}
          trackWizardPageEvent={trackWizardPageEvent}
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
          moduleClass={moduleClass}
          trackWizardPageEvent={trackWizardPageEvent}
        />
        <CreateServiceTemplate
          moduleClass={moduleClass}
          trackWizardPageEvent={trackWizardPageEvent}
        />

        <CreateServiceAuth
          moduleClass={moduleClass}
          trackWizardPageEvent={trackWizardPageEvent}
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
        />
      </ServiceWizard>
      <Snackbar open={Boolean(errorCreateService)} message={errorMessage} />
    </Modal>
  );
};

export default CreateServiceWizard;
