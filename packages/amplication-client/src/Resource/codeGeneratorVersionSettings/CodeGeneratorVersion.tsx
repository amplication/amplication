import CodeGeneratorVersionForm, {
  CodeGenerationVersionSettings,
} from "./CodeGeneratorVersionForm";
import * as models from "../../models";
import {
  GET_CODE_GENERATOR_VERSION,
  GET_CODE_GENERATOR_VERSIONS,
} from "./queries";
import { useQuery } from "@apollo/client";
import { useMemo } from "react";

export type TCodeGeneratorVersionData = {
  name: string;
  changelog: string;
  isDeprecated: boolean;
};

const DEFAULT_VALUES: CodeGenerationVersionSettings = {
  version: "1.0.0",
  useSpecificVersion: false,
  autoUseLatestMinorVersion: false,
};

const CodeGeneratorVersion = () => {
  const handleOnSubmit = (data) => {
    console.log(data, "handleOnSubmit");
  };

  const { data: latestCodeGeneratorVersion } =
    useQuery<TCodeGeneratorVersionData>(GET_CODE_GENERATOR_VERSION, {
      context: {
        clientName: "codeGeneratorCatalogHttpLink",
      },
      variables: {
        codeGeneratorStrategy: models.CodeGeneratorVersionStrategy.LatestMajor,
      },
    });

  console.log(latestCodeGeneratorVersion, "latestCodeGeneratorVersion");

  const { data: codeGeneratorVersionList } = useQuery<
    TCodeGeneratorVersionData[]
  >(GET_CODE_GENERATOR_VERSIONS, {
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
    return codeGeneratorVersionList?.map(({ name }) => name);
  }, [codeGeneratorVersionList]);

  return (
    <div>
      <CodeGeneratorVersionForm
        onSubmit={handleOnSubmit}
        defaultValues={DEFAULT_VALUES}
        codeGeneratorVersionList={codeGeneratorVersionNameList}
        latestMajorVersion={latestCodeGeneratorVersion?.name}
      />
    </div>
  );
};

export default CodeGeneratorVersion;
