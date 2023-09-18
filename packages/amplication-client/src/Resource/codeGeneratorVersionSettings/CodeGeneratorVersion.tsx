import CodeGeneratorVersionForm, {
  CodeGenerationVersionSettings,
} from "./CodeGeneratorVersionForm";
import * as models from "../../models";
import {
  GET_CODE_GENERATOR_VERSIONS,
  GET_CODE_GENERATOR_VERSION_FOR_LAST_BUILD,
  GET_CURRENT_CODE_GENERATOR_VERSION,
} from "./queries";
import { useQuery } from "@apollo/client";
import { useCallback, useContext, useMemo } from "react";
import "./CodeGeneratorVersion.scss";
import { AppContext } from "../../context/appContext";
import { Panel } from "@amplication/ui/design-system";
import { useHistory } from "react-router-dom";
import { useTracking } from "react-tracking";
import { AnalyticsEventNames } from "../../util/analytics-events.types";
import { DSGCatalog } from "./Catalog";

const CLASS_NAME = "code-generator-version";

export type CodeGeneratorVersionData = {
  name: string;
  changelog: string;
  isDeprecated: boolean;
};

export type TCodeGeneratorVersion = {
  getCodeGeneratorVersion: Pick<CodeGeneratorVersionData, "name">;
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
  const { currentResource, currentWorkspace, updateCodeGeneratorVersion } =
    useContext(AppContext);

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

  const { data: currentCodeGeneratorVersion } = useQuery<TCodeGeneratorVersion>(
    GET_CURRENT_CODE_GENERATOR_VERSION,
    {
      context: {
        clientName: "codeGeneratorCatalogHttpLink",
      },
      variables: {
        getCodeGeneratorVersionInput: {
          codeGeneratorStrategy: currentResource?.codeGeneratorStrategy,
          codeGeneratorVersion: currentResource?.codeGeneratorVersion,
        },
      },
      skip: !currentResource,
    }
  );

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
        skip: !currentResource,
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

  const handleSubmit = useCallback((data: CodeGenerationVersionSettings) => {
    let codeGeneratorStrategy = models.CodeGeneratorVersionStrategy.LatestMajor;
    let codeGeneratorVersion;

    if (data.useSpecificVersion) {
      codeGeneratorStrategy = data.autoUseLatestMinorVersion
        ? models.CodeGeneratorVersionStrategy.LatestMinor
        : models.CodeGeneratorVersionStrategy.Specific;
      codeGeneratorVersion = data.version;
    }

    updateCodeGeneratorVersion({
      updateCodeGeneratorVersion: {
        codeGeneratorStrategy,
        codeGeneratorVersion,
      },
      resourceId: currentResource?.id,
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
              Code generator version used for:
              <ul>
                <li>
                  your last build:&nbsp;
                  <strong>
                    {codeGeneratorVersionLastBuild?.resource?.builds[0]
                      ?.codeGeneratorVersion ?? codeGeneratorVersionNameList[0]}
                  </strong>
                </li>
                <li>
                  current next build:&nbsp;
                  <strong>
                    {currentCodeGeneratorVersion?.getCodeGeneratorVersion?.name}
                  </strong>
                </li>
              </ul>
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
            <DSGCatalog
              name={version.name}
              changelog={version.changelog}
              key={version.name}
            />
          ))}
      </div>
    </div>
  );
};

export default CodeGeneratorVersion;
