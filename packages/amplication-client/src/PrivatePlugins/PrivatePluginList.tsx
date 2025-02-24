import {
  CircularProgress,
  CollapsibleListItem,
  EnabledIndicator,
  EnumFlexDirection,
  EnumIconFamily,
  EnumItemsAlign,
  FlexItem,
  SearchField,
  Snackbar,
  VerticalNavigation,
  VerticalNavigationItem,
} from "@amplication/ui/design-system";
import { isEmpty } from "lodash";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { AppContext } from "../context/appContext";
import { formatError } from "../util/error";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";
import usePrivatePlugin from "./hooks/usePrivatePlugin";
import { NewPrivatePluginButton } from "./NewPrivatePluginButton";
import "./PrivatePluginList.scss";

const CLASS_NAME = "private-plugin-list";

type Props = {
  selectFirst?: boolean;
};

export const PrivatePluginList = React.memo(
  ({ selectFirst = false }: Props) => {
    const [searchPhrase, setSearchPhrase] = useState<string>("");
    const { pluginRepositoryResource } = useContext(AppContext);

    const { baseUrl } = useProjectBaseUrl({ overrideIsPlatformConsole: true });

    const {
      privatePluginsByCodeGenerator,
      loadPrivatePlugins,
      loadPrivatePluginsError: error,
      loadPrivatePluginsLoading: loading,
      getPluginRepositoryRemotePlugins,
    } = usePrivatePlugin(pluginRepositoryResource?.id);

    const handleSearchChange = useCallback(
      (value) => {
        setSearchPhrase(value);
      },
      [setSearchPhrase]
    );

    const history = useHistory();
    const hasError = Boolean(error);
    const errorMessage = formatError(error);

    useEffect(() => {
      if (selectFirst && privatePluginsByCodeGenerator) {
        const firstCodeGenerator = Object.values(
          privatePluginsByCodeGenerator
        )[0];
        if (isEmpty(firstCodeGenerator) || firstCodeGenerator.length === 0) {
          return;
        }
        const privatePlugin = firstCodeGenerator[0];
        const fieldUrl = `${baseUrl}/private-plugins/list/${privatePlugin.id}`;
        history.push(fieldUrl);
      }
    }, [privatePluginsByCodeGenerator, selectFirst, history, baseUrl]);

    useEffect(() => {
      loadPrivatePlugins(searchPhrase);
    }, [loadPrivatePlugins, searchPhrase]);

    useEffect(() => {
      if (!pluginRepositoryResource) {
        return;
      }
      getPluginRepositoryRemotePlugins({
        variables: {
          where: {
            id: pluginRepositoryResource.id,
          },
        },
      });
    }, [getPluginRepositoryRemotePlugins, pluginRepositoryResource]);

    return (
      <div className={CLASS_NAME}>
        <FlexItem
          direction={EnumFlexDirection.Column}
          itemsAlign={EnumItemsAlign.Stretch}
        >
          <NewPrivatePluginButton />

          <SearchField
            label="search"
            placeholder="search"
            onChange={handleSearchChange}
          />
        </FlexItem>

        {privatePluginsByCodeGenerator &&
          Object.entries(privatePluginsByCodeGenerator).map(
            ([codeGenerator, privatePlugins]) => (
              <CollapsibleListItem
                key={codeGenerator}
                initiallyExpanded
                icon={"code"}
                expandable
                childItems={
                  <>
                    <VerticalNavigation>
                      {privatePlugins.map((privatePlugin) => (
                        <VerticalNavigationItem
                          key={privatePlugin.id}
                          icon={privatePlugin.icon ?? "plugin"}
                          iconFamily={
                            privatePlugin.icon
                              ? EnumIconFamily.Custom
                              : undefined
                          }
                          to={`${baseUrl}/private-plugins/list/${privatePlugin.id}`}
                        >
                          <FlexItem
                            itemsAlign={EnumItemsAlign.Center}
                            end={
                              <EnabledIndicator
                                enabled={privatePlugin.enabled}
                              />
                            }
                            singeChildWithEllipsis
                          >
                            {privatePlugin.displayName}
                          </FlexItem>
                        </VerticalNavigationItem>
                      ))}
                    </VerticalNavigation>
                  </>
                }
              >
                <span>{`${codeGenerator}`} Plugins</span>
              </CollapsibleListItem>
            )
          )}

        {loading && <CircularProgress />}

        <Snackbar open={hasError} message={errorMessage} />
      </div>
    );
  }
);
