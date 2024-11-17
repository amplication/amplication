import {
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumGapSize,
  EnumItemsAlign,
  EnumPanelStyle,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  HorizontalRule,
  List,
  Panel,
  PanelCollapsible,
  TabContentTitle,
  Text,
} from "@amplication/ui/design-system";
import { useQuery } from "@apollo/client";
import { useCallback, useContext, useMemo } from "react";
import { AppContext } from "../../context/appContext";
import * as models from "../../models";
import { DSGCatalog } from "./Catalog";
import CodeGeneratorVersionForm, {
  CodeGenerationVersionSettings,
} from "./CodeGeneratorVersionForm";
import {
  GET_CODE_GENERATOR_VERSIONS,
  GET_CODE_GENERATOR_VERSION_FOR_LAST_BUILD,
  GET_CURRENT_CODE_GENERATOR_VERSION,
} from "./queries";

export type CodeGeneratorVersionData = {
  name: string;
  changelog: string;
  isDeprecated: boolean;
};

export type TCodeGeneratorVersion = {
  getCodeGeneratorVersion: Pick<CodeGeneratorVersionData, "name">;
};

export type TCodeGeneratorVersionListData = {
  generators: {
    id: string;
    name: string;
    fullName: string;
    version: CodeGeneratorVersionData[];
  }[];
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

const CODE_GENERATOR_ENUM_TO_NAME: {
  [key in models.EnumCodeGenerator]: string;
} = {
  [models.EnumCodeGenerator.NodeJs]: "NodeJS",
  [models.EnumCodeGenerator.DotNet]: "DotNET",
  [models.EnumCodeGenerator.Blueprint]: "Blueprint",
};

const CodeGeneratorVersion = () => {
  const { currentResource, updateCodeGeneratorVersion } =
    useContext(AppContext);

  const { data: currentCodeGeneratorVersion } = useQuery<TCodeGeneratorVersion>(
    GET_CURRENT_CODE_GENERATOR_VERSION,
    {
      context: {
        clientName: "codeGeneratorCatalogHttpLink",
      },
      variables: {
        getCodeGeneratorVersionInput: {
          codeGeneratorFullName: "data-service-generator",
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
        generatorName:
          CODE_GENERATOR_ENUM_TO_NAME[currentResource.codeGenerator],
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
    return codeGeneratorVersionList?.generators[0]?.version?.map(
      (version) => version.name
    );
  }, [codeGeneratorVersionList]);

  return (
    <div>
      <TabContentTitle
        title="Code Generator Version Settings"
        subTitle="Control the version of the code generator to be used
                when generating the code."
      />
      <HorizontalRule />

      <Panel panelStyle={EnumPanelStyle.Default}>
        <FlexItem
          direction={EnumFlexDirection.Column}
          gap={EnumGapSize.Small}
          margin={EnumFlexItemMargin.Bottom}
        >
          <Text textStyle={EnumTextStyle.Normal}>
            New major versions may include breaking changes and updates to major
            version of core frameworks like NodeJS, NestJS, Prisma, etc.
          </Text>
          <Text textStyle={EnumTextStyle.Normal}>
            In case you are not ready to upgrade to a new major version, you can
            select a specific Code Generator version
          </Text>
        </FlexItem>
        <FlexItem
          gap={EnumGapSize.Small}
          direction={EnumFlexDirection.Row}
          itemsAlign={EnumItemsAlign.Center}
        >
          <Text textStyle={EnumTextStyle.Description}>
            Version used on your last build:
          </Text>

          <Text
            textStyle={EnumTextStyle.Description}
            textColor={EnumTextColor.White}
          >
            {codeGeneratorVersionLastBuild?.resource?.builds[0]
              ?.codeGeneratorVersion ?? codeGeneratorVersionNameList?.length
              ? codeGeneratorVersionNameList[0]
              : "N/A"}
          </Text>
        </FlexItem>
        <FlexItem
          gap={EnumGapSize.Small}
          direction={EnumFlexDirection.Row}
          itemsAlign={EnumItemsAlign.Center}
          margin={EnumFlexItemMargin.Bottom}
        >
          <Text textStyle={EnumTextStyle.Description}>
            Version for your next build
          </Text>

          <Text
            textStyle={EnumTextStyle.Description}
            textColor={EnumTextColor.ThemeTurquoise}
          >
            {currentCodeGeneratorVersion?.getCodeGeneratorVersion?.name}
          </Text>
        </FlexItem>
      </Panel>

      <FlexItem margin={EnumFlexItemMargin.Top} />
      <CodeGeneratorVersionForm
        onSubmit={handleSubmit}
        defaultValues={defaultValues(currentResource)}
        codeGeneratorVersionList={codeGeneratorVersionNameList}
      />

      <HorizontalRule />

      <PanelCollapsible headerContent={"Version History"}>
        {codeGeneratorVersionList?.generators[0]?.version.length && (
          <List>
            {codeGeneratorVersionList.generators[0].version.map((version) => (
              <DSGCatalog
                name={version.name}
                changelog={version.changelog}
                key={version.name}
              />
            ))}
          </List>
        )}
      </PanelCollapsible>
    </div>
  );
};

export default CodeGeneratorVersion;
