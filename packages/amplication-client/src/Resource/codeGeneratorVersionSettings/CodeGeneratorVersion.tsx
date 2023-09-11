import CodeGeneratorVersionForm, {
  CodeGenerationVersionSettings,
} from "./CodeGeneratorVersionForm";
import * as models from "../../models";
import {
  GET_CODE_GENERATOR_VERSION,
  GET_CODE_GENERATOR_VERSIONS,
} from "./queries";
import { useQuery } from "@apollo/client";
import { useCallback, useMemo, useState } from "react";
import "./CodeGeneratorVersion.scss";

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

const DEFAULT_VALUES: CodeGenerationVersionSettings = {
  version: "1.8.10",
  useSpecificVersion: false,
  autoUseLatestMinorVersion: false,
};

const CodeGeneratorVersion = () => {
  const [defaultValues, setDefaultValues] =
    useState<CodeGenerationVersionSettings>(DEFAULT_VALUES);

  const handleSubmit = useCallback((data) => {
    console.log(data, handleSubmit);
  }, []);

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
      onCompleted: (data) => {
        setDefaultValues({
          ...DEFAULT_VALUES,
          version: data.getCodeGeneratorVersion.name,
        });
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

  const codeGeneratorVersionNameList = useMemo(() => {
    return codeGeneratorVersionList?.versions.map((version) => version.name);
  }, [codeGeneratorVersionList]);

  return (
    <div>
      <div className={`${CLASS_NAME}__title`}>
        <h3>Code Generator Version Settings</h3>
      </div>
      <CodeGeneratorVersionForm
        onSubmit={handleSubmit}
        defaultValues={defaultValues}
        codeGeneratorVersionList={codeGeneratorVersionNameList}
        latestMajorVersion={
          latestCodeGeneratorVersion?.getCodeGeneratorVersion.name
        }
      />
    </div>
  );
};

export default CodeGeneratorVersion;
