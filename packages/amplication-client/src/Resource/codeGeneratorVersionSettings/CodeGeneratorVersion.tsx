import CodeGeneratorVersionForm, {
  CodeGenerationVersionSettings,
} from "./CodeGeneratorVersionForm";
import * as models from "../../models";
import {
  GET_CODE_GENERATOR_VERSIONS,
  GET_CODE_GENERATOR_VERSION_FOR_LAST_BUILD,
  UPDATE_CODE_GENERATOR_VERSION,
} from "./queries";
import { useMutation, useQuery } from "@apollo/client";
import { useCallback, useContext, useMemo } from "react";
import "./CodeGeneratorVersion.scss";
import { AppContext } from "../../context/appContext";
import { Panel } from "@amplication/ui/design-system";
import { useHistory } from "react-router-dom";
import { useTracking } from "react-tracking";
import { AnalyticsEventNames } from "../../util/analytics-events.types";
import { DSGCatalog } from "./Catalog";

const CLASS_NAME = "code-generator-version";
const CODE_GENERATOR_VERSION_PLACEHOLDER = "N/A";

export type CodeGeneratorVersionData = {
  name: string;
  changelog: string;
  isDeprecated: boolean;
};

export type TCodeGeneratorVersion = {
  getCodeGeneratorVersion: CodeGeneratorVersionData;
};

export type TCodeGeneratorVersionListData = {
  versions: CodeGeneratorVersionData[];
};

export type TCodeGeneratorVersionLastBuild = {
  resource: {
    builds: {
      id: string;
      codeGeneratorVersion: string | null;
    }[];
  };
};

export type TUpdateCodeGeneratorVersion = {
  updateCodeGeneratorVersion: {
    codeGeneratorStrategy: models.CodeGeneratorVersionStrategy | null;
    codeGeneratorVersion: string | null;
  };
};

const resourceCodeGeneratorDataToCodeGeneratorVersionSettings = {
  [models.CodeGeneratorVersionStrategy.LatestMajor]: {
    useSpecificVersion: false,
    autoUseLatestMinorVersion: false,
  },
  [models.CodeGeneratorVersionStrategy.LatestMinor]: {
    useSpecificVersion: true,
    autoUseLatestMinorVersion: true,
  },
  [models.CodeGeneratorVersionStrategy.Specific]: {
    useSpecificVersion: true,
    autoUseLatestMinorVersion: false,
  },
};

const defaultValues = (
  resource: models.Resource
): CodeGenerationVersionSettings => {
  const defaultValues: CodeGenerationVersionSettings = {
    version: resource?.codeGeneratorVersion,
    useSpecificVersion: false,
    autoUseLatestMinorVersion: false,
  };

  return {
    ...defaultValues,
    ...resourceCodeGeneratorDataToCodeGeneratorVersionSettings[
      resource?.codeGeneratorStrategy
    ],
  };
};

const CodeGeneratorVersion = () => {
  const { currentResource, currentWorkspace } = useContext(AppContext);
  const history = useHistory();
  const { trackEvent } = useTracking();

  const handleViewPlansClick = useCallback(() => {
    history.push(`/${currentWorkspace.id}/purchase`, {
      from: { pathname: window.location.pathname },
    });
    trackEvent({
      eventName: AnalyticsEventNames.UpgradeFromCodeGeneratorVersionClick,
      workspace: currentWorkspace.id,
    });
  }, [currentWorkspace, window.location.pathname]);

  const { data: codeGeneratorVersionLastBuild } =
    useQuery<TCodeGeneratorVersionLastBuild>(
      GET_CODE_GENERATOR_VERSION_FOR_LAST_BUILD,
      {
        variables: {
          where: {
            id: currentResource?.id,
          },
          orderBy: {
            createdAt: "Desc",
          },
          take: 1,
        },
      }
    );

  const { data: codeGeneratorVersionList } =
    useQuery<TCodeGeneratorVersionListData>(GET_CODE_GENERATOR_VERSIONS, {
      context: {
        clientName: "codeGeneratorCatalogHttpLink",
      },
      variables: {
        codeGeneratorStrategy: models.CodeGeneratorVersionStrategy.Specific,
        where: {
          isActive: {
            equals: true,
          },
        },
        orderBy: [
          {
            createdAt: "Desc",
          },
        ],
      },
    });

  // use mutation to update code generator version
  const [updateCodeGeneratorVersion] = useMutation<TUpdateCodeGeneratorVersion>(
    UPDATE_CODE_GENERATOR_VERSION
  );

  const handleSubmit = useCallback((data: CodeGenerationVersionSettings) => {
    let CodeGeneratorVersionStrategy =
      models.CodeGeneratorVersionStrategy.LatestMajor;
    let version = null;

    if (data.useSpecificVersion) {
      CodeGeneratorVersionStrategy = data.autoUseLatestMinorVersion
        ? models.CodeGeneratorVersionStrategy.LatestMinor
        : models.CodeGeneratorVersionStrategy.Specific;
      version = data.version;
    }

    updateCodeGeneratorVersion({
      variables: {
        data: {
          codeGeneratorVersionOptions: {
            codeGeneratorStrategy: CodeGeneratorVersionStrategy,
            codeGeneratorVersion: version,
          },
        },
        where: {
          id: currentResource?.id,
        },
      },
    });
  }, []);

  const codeGeneratorVersionNameList = useMemo(() => {
    if (!codeGeneratorVersionList) return [];
    return codeGeneratorVersionList?.versions.map((version) => version.name);
  }, [codeGeneratorVersionList]);

  return (
    <div>
      <div className={`${CLASS_NAME}__header`}>
        <h3>Code Generator Version Settings</h3>
        <Panel>
          <div className={`${CLASS_NAME}__message`}>
            <div className={`${CLASS_NAME}__title`}>
              Code generator version used for the latest build:{" "}
              <span className={`${CLASS_NAME}__tag`}>
                {codeGeneratorVersionLastBuild?.resource?.builds[0]
                  ?.codeGeneratorVersion ?? CODE_GENERATOR_VERSION_PLACEHOLDER}
              </span>
            </div>

            <div className={`${CLASS_NAME}__explanation`}>
              <div>
                You can control the version of the code generator to be used
                when generating the code.
              </div>
              <div>
                New major versions may include breaking changes and updates to
                major version of core frameworks like NodeJS, NestJS, Prisma,
                etc.
              </div>
            </div>

            <div className={`${CLASS_NAME}__instructions`}>
              In case you are not ready to upgrade to a new major version, you
              can select a specific Code Generator version
            </div>
          </div>
        </Panel>
      </div>

      <CodeGeneratorVersionForm
        onSubmit={handleSubmit}
        onViewPlansClick={handleViewPlansClick}
        defaultValues={defaultValues(currentResource)}
        codeGeneratorVersionList={codeGeneratorVersionNameList}
      />
      <hr className={`${CLASS_NAME}__divider`} />

      <div className={`${CLASS_NAME}__catalog`}>
        <h3>Versions History</h3>
        {codeGeneratorVersionList?.versions.length &&
          codeGeneratorVersionList.versions.map((version) => (
            <DSGCatalog name={version.name} changelog={version.changelog} />
          ))}
      </div>
    </div>
  );
};

export default CodeGeneratorVersion;
