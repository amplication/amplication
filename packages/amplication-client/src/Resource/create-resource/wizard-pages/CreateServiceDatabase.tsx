import React, { useCallback, useEffect, useMemo } from "react";
import { CreateServiceWizardLayout as Layout } from "../CreateServiceWizardLayout";
import { LabelDescriptionSelector } from "./LabelDescriptionSelector";
import { WizardStepProps } from "./interfaces";

import "../CreateServiceWizard.scss";
import {
  EnumFlexItemMargin,
  EnumTextStyle,
  FlexItem,
  Text,
} from "@amplication/ui/design-system";
import { Plugin } from "../../../Plugins/hooks/usePluginCatalog";

import { PluginLogo } from "../../../Plugins/PluginLogo";
import { EnumCodeGenerator } from "../../../models";

const NODE_DB_PLUGINS = ["db-postgres", "db-mongo", "db-mysql", "db-mssql"];
const DOTNET_DB_PLUGINS = ["dotnet-db-sqlserver", "dotnet-db-postgres"];

const OVERRIDE_PLUGIN_NAME = {
  "dotnet-db-postgres": "PostgreSQL DB",
  "dotnet-db-sqlserver": "MS SQL Server DB",
};
const OVERRIDE_PLUGIN_DESCRIPTION = {
  "db-postgres":
    "Open-source object-relational database with a strong community",
  "db-mongo": "Scalable NoSQL database for unstructured data",
  "db-mysql": "Reliable open-source relational database for web applications",
  "db-mssql": "High-performance, secure relational database by Microsoft",
  "dotnet-db-postgres":
    "Open-source object-relational database with a strong community",
  "dotnet-db-sqlserver":
    "High-performance, secure relational database by Microsoft",
};

type Props = WizardStepProps & {
  pluginCatalog: { [key: string]: Plugin };
};

const CreateServiceDatabase: React.FC<Props> = ({ formik, pluginCatalog }) => {
  const pluginList = useMemo(() => {
    if (!pluginCatalog) {
      return [];
    }

    if (formik.values.codeGenerator === EnumCodeGenerator.DotNet) {
      return DOTNET_DB_PLUGINS.map((plugin) => pluginCatalog[plugin]).filter(
        (plugin) => plugin
      );
    } else {
      return NODE_DB_PLUGINS.map((plugin) => pluginCatalog[plugin]).filter(
        (plugin) => plugin
      );
    }
  }, [formik, pluginCatalog]);

  useEffect(() => {
    if (
      pluginList &&
      pluginList.length > 0 &&
      !pluginList.find(
        (plugin) => plugin.pluginId === formik.values.databaseType
      )
    ) {
      formik.setFieldValue("databaseType", pluginList[0].pluginId);
    }
  }, [formik, pluginList]);

  const handleDatabaseSelect = useCallback(
    (database: string) => {
      formik.setValues(
        {
          ...formik.values,
          databaseType: database,
        },
        true
      );
    },
    [formik]
  );
  return (
    <Layout.Split>
      <Layout.LeftSide>
        <Layout.Description
          header="Which database do you want to use?"
          text={`Amplication generates the service with all the required configuration and code to start working with a DB. 
          
          You can easily change the type of the DB later in the plugins page.
          `}
        />
      </Layout.LeftSide>
      <Layout.RightSide>
        <Layout.SelectorWrapper>
          {pluginList.map(
            (plugin) =>
              plugin && (
                <LabelDescriptionSelector
                  name={plugin.pluginId}
                  label={OVERRIDE_PLUGIN_NAME[plugin.pluginId] || plugin.name}
                  excludeImageWrapper
                  image={<PluginLogo plugin={plugin} />}
                  description={
                    OVERRIDE_PLUGIN_DESCRIPTION[plugin.pluginId] ||
                    plugin.description
                  }
                  onClick={handleDatabaseSelect}
                  currentValue={formik.values.databaseType}
                />
              )
          )}
        </Layout.SelectorWrapper>
        <FlexItem margin={EnumFlexItemMargin.Top}>
          <Text textStyle={EnumTextStyle.Tag}>
            Need a different database? You can customize and extend your
            services with our community-driven plugin system.
          </Text>
        </FlexItem>
      </Layout.RightSide>
    </Layout.Split>
  );
};

export default CreateServiceDatabase;
