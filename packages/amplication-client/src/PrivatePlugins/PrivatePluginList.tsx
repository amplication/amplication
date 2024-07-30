import {
  CircularProgress,
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
import { pluralize } from "../util/pluralize";
import NewPrivatePlugin from "./NewPrivatePlugin";
import "./PrivatePluginList.scss";
import usePrivatePlugin from "./hooks/usePrivatePlugin";

const CLASS_NAME = "private-plugin-list";

type Props = {
  resourceId: string;
  selectFirst?: boolean;
};

export const PrivatePluginList = React.memo(
  ({ resourceId, selectFirst = false }: Props) => {
    const [searchPhrase, setSearchPhrase] = useState<string>("");
    const { currentWorkspace, currentProject, currentResource } =
      useContext(AppContext);

    const {
      getPrivatePluginsData: data,
      getPrivatePlugins,
      getPrivatePluginsError: error,
      getPrivatePluginsLoading: loading,
    } = usePrivatePlugin(currentResource?.id);

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
        const fieldUrl = `/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/private-plugins/${privatePlugin.id}`;
        history.push(fieldUrl);
      },
      [history, resourceId, currentWorkspace, currentProject]
    );

    useEffect(() => {
      if (selectFirst && data && !isEmpty(data.privatePlugins)) {
        const privatePlugin = data.privatePlugins[0];
        const fieldUrl = `/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/private-plugins/${privatePlugin.id}`;
        history.push(fieldUrl);
      }
    }, [
      data,
      selectFirst,
      resourceId,
      history,
      currentWorkspace,
      currentProject,
    ]);

    useEffect(() => {
      getPrivatePlugins(searchPhrase);
    }, [getPrivatePlugins, resourceId, searchPhrase]);

    return (
      <div className={CLASS_NAME}>
        <SearchField
          label="search"
          placeholder="search"
          onChange={handleSearchChange}
        />
        <div className={`${CLASS_NAME}__header`}>
          {data?.privatePlugins.length}{" "}
          {pluralize(
            data?.privatePlugins.length,
            "Private Plugin",
            "Private Plugins"
          )}
        </div>
        {loading && <CircularProgress />}
        <div className={`${CLASS_NAME}__list`}>
          {data?.privatePlugins?.map((privatePlugin) => (
            <div key={privatePlugin.id} className={`${CLASS_NAME}__list__item`}>
              <InnerTabLink
                icon="plugin"
                to={`/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/private-plugins/${privatePlugin.id}`}
              >
                <span>{privatePlugin.displayName}</span>
              </InnerTabLink>
            </div>
          ))}
        </div>
        {data?.privatePlugins && (
          <NewPrivatePlugin
            onPrivatePluginAdd={handlePrivatePluginChange}
            resourceId={resourceId}
          />
        )}
        <Snackbar open={Boolean(error)} message={errorMessage} />
      </div>
    );
  }
);
