import {
  CircularProgress,
  EnabledIndicator,
  EnumItemsAlign,
  FlexItem,
  HorizontalRule,
  SearchField,
  Snackbar,
} from "@amplication/ui/design-system";
import { isEmpty } from "lodash";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import InnerTabLink from "../Layout/InnerTabLink";
import { AppContext } from "../context/appContext";
import * as models from "../models";
import { formatError } from "../util/error";
import NewPrivatePlugin from "./NewPrivatePlugin";
import "./PrivatePluginList.scss";
import usePrivatePlugin from "./hooks/usePrivatePlugin";

const CLASS_NAME = "private-plugin-list";

type Props = {
  selectFirst?: boolean;
};

export const PrivatePluginList = React.memo(
  ({ selectFirst = false }: Props) => {
    const [searchPhrase, setSearchPhrase] = useState<string>("");
    const { currentWorkspace, currentProject, pluginRepositoryResource } =
      useContext(AppContext);

    const {
      getPrivatePluginsData: data,
      getPrivatePlugins,
      getPrivatePluginsError: error,
      getPrivatePluginsLoading: loading,
    } = usePrivatePlugin(pluginRepositoryResource?.id);

    const handleSearchChange = useCallback(
      (value) => {
        setSearchPhrase(value);
      },
      [setSearchPhrase]
    );
    const history = useHistory();

    const errorMessage = formatError(error);

    const handlePrivatePluginChange = useCallback(
      (privatePlugin: models.PrivatePlugin) => {
        const fieldUrl = `/${currentWorkspace?.id}/platform/${currentProject?.id}/private-plugins/${privatePlugin.id}`;
        history.push(fieldUrl);
      },
      [history, currentWorkspace, currentProject]
    );

    useEffect(() => {
      if (selectFirst && data && !isEmpty(data.privatePlugins)) {
        const privatePlugin = data.privatePlugins[0];
        const fieldUrl = `/${currentWorkspace?.id}/platform/${currentProject?.id}/private-plugins/${privatePlugin.id}`;
        history.push(fieldUrl);
      }
    }, [data, selectFirst, history, currentWorkspace, currentProject]);

    useEffect(() => {
      getPrivatePlugins(searchPhrase);
    }, [getPrivatePlugins, searchPhrase]);

    return (
      <div className={CLASS_NAME}>
        <InnerTabLink
          icon="settings"
          to={`/${currentWorkspace?.id}/platform/${currentProject?.id}/private-plugins/git-settings`}
        >
          <FlexItem itemsAlign={EnumItemsAlign.Center}>Git Settings</FlexItem>
        </InnerTabLink>
        <HorizontalRule />
        <SearchField
          label="search"
          placeholder="search"
          onChange={handleSearchChange}
        />

        {loading && <CircularProgress />}
        <div className={`${CLASS_NAME}__list`}>
          {data?.privatePlugins?.map((privatePlugin) => (
            <InnerTabLink
              key={privatePlugin.id}
              icon="plugin"
              to={`/${currentWorkspace?.id}/platform/${currentProject?.id}/private-plugins/${privatePlugin.id}`}
            >
              <FlexItem
                itemsAlign={EnumItemsAlign.Center}
                end={<EnabledIndicator enabled={privatePlugin.enabled} />}
                singeChildWithEllipsis
              >
                {privatePlugin.displayName}
              </FlexItem>
            </InnerTabLink>
          ))}
        </div>
        {data?.privatePlugins && (
          <NewPrivatePlugin
            onPrivatePluginAdd={handlePrivatePluginChange}
            resourceId={pluginRepositoryResource?.id}
          />
        )}
        <Snackbar open={Boolean(error)} message={errorMessage} />
      </div>
    );
  }
);
