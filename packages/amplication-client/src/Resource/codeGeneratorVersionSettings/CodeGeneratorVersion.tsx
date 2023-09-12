import CodeGeneratorVersionForm, {
  CodeGenerationVersionSettings,
} from "./CodeGeneratorVersionForm";
import * as models from "../../models";
import {
  GET_CODE_GENERATOR_VERSION,
  GET_CODE_GENERATOR_VERSIONS,
  GET_CODE_GENERATOR_VERSION_FOR_LAST_BUILD,
  UPDATE_CODE_GENERATOR_VERSION,
} from "./queries";
import { useMutation, useQuery } from "@apollo/client";
import { useCallback, useContext, useMemo } from "react";
import "./CodeGeneratorVersion.scss";
import { AppContext } from "../../context/appContext";

const CLASS_NAME = "code-generator-version";

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
  const { currentResource } = useContext(AppContext);

  const { data: latestCodeGeneratorVersion } = useQuery<TCodeGeneratorVersion>(
    GET_CODE_GENERATOR_VERSION,
    {
      context: {
        clientName: "codeGeneratorCatalogHttpLink",
      },
      variables: {
        getCodeGeneratorVersionInput: {
          codeGeneratorStrategy:
            models.CodeGeneratorVersionStrategy.LatestMajor,
        },
      },
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
      <div className={`${CLASS_NAME}__title`}>
        <h3>Code Generator Version Settings</h3>
      </div>
      <CodeGeneratorVersionForm
        onSubmit={handleSubmit}
        defaultValues={defaultValues(currentResource)}
        codeGeneratorVersionList={codeGeneratorVersionNameList}
        latestMajorVersion={
          codeGeneratorVersionLastBuild?.resource.builds[0]
            .codeGeneratorVersion ??
          latestCodeGeneratorVersion?.getCodeGeneratorVersion.name
        }
      />
    </div>
  );
};

export default CodeGeneratorVersion;
