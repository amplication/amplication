import React, { useCallback, useEffect, useMemo } from "react";
import { PluginLogo } from "../../../Plugins/PluginLogo";
import usePlugins from "../../../Plugins/hooks/usePlugins";
import { EnumCodeGenerator } from "../../../models";
import "../CreateServiceWizard.scss";
import { CreateServiceWizardLayout as Layout } from "../CreateServiceWizardLayout";
import { LabelDescriptionSelector } from "./LabelDescriptionSelector";
import { WizardStepProps } from "./interfaces";

const NODE_AUTH_PLUGINS = ["auth-jwt", "auth-basic", "auth-keycloak"];
const DOTNET_AUTH_PLUGINS = ["dotnet-auth-core-identity"];

const OVERRIDE_PLUGIN_DESCRIPTION = {
  "auth-jwt": "Use JSON Web Token (JWT) authentication",
  "auth-basic": "Use basic (username-password) authentication",
  "auth-keycloak": "Use Keycloak authentication",
  "dotnet-auth-core-identity": "Use ASP.NET Core Identity authentication",
};

const CreateServiceAuth: React.FC<WizardStepProps> = ({ formik }) => {
  const { pluginCatalog } = usePlugins(null, null);

  const pluginList = useMemo(() => {
    if (!pluginCatalog) {
      return [];
    }

    if (formik.values.codeGenerator === EnumCodeGenerator.DotNet) {
      return DOTNET_AUTH_PLUGINS.map((plugin) => pluginCatalog[plugin]).filter(
        (plugin) => plugin
      );
    } else {
      return NODE_AUTH_PLUGINS.map((plugin) => pluginCatalog[plugin]).filter(
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
      formik.setFieldValue("authType", pluginList[0].pluginId);
    }
  }, [formik, pluginList]);

  const handleAuthSelect = useCallback(
    (authType: string) => {
      formik.setValues(
        {
          ...formik.values,
          authType,
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
          header="Does your service need Authentication?"
          text={`Choose whether or not to enable authentication and authorization for  your service.`}
        />
      </Layout.LeftSide>
      <Layout.RightSide>
        <Layout.SelectorWrapper>
          {pluginList.map(
            (plugin) =>
              plugin && (
                <LabelDescriptionSelector
                  name={plugin.pluginId}
                  label={plugin.name}
                  excludeImageWrapper
                  image={<PluginLogo plugin={plugin} />}
                  description={
                    OVERRIDE_PLUGIN_DESCRIPTION[plugin.pluginId] ||
                    plugin.description
                  }
                  onClick={handleAuthSelect}
                  currentValue={formik.values.authType}
                />
              )
          )}
          <LabelDescriptionSelector
            name="no"
            icon="unlock"
            label="Skip Authentication"
            description="Do not include code for authentication"
            onClick={handleAuthSelect}
            currentValue={formik.values.authType}
          />
        </Layout.SelectorWrapper>
      </Layout.RightSide>
    </Layout.Split>
  );
};

export default CreateServiceAuth;
