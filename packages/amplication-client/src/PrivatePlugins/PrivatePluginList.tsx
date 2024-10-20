import {
  CircularProgress,
  CollapsibleListItem,
  EnabledIndicator,
  EnumItemsAlign,
  FlexItem,
  HorizontalRule,
  SearchField,
  Snackbar,
  VerticalNavigation,
  VerticalNavigationItem,
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
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";

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
      getPrivatePluginsByCodeGeneratorData: data,
      getPrivatePluginsByCodeGenerator,
      getPrivatePluginsByCodeGeneratorError: error,
      getPrivatePluginsByCodeGeneratorLoading: loading,
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
        const fieldUrl = `${baseUrl}/private-plugins/${privatePlugin.id}`;
        history.push(fieldUrl);
      },
      [history, baseUrl]
    );

    useEffect(() => {
      if (selectFirst && data) {
        const firstCodeGenerator = data[0];
        if (isEmpty(firstCodeGenerator) || firstCodeGenerator.length === 0) {
          return;
        }

        const privatePlugin = firstCodeGenerator[0];
        const fieldUrl = `${baseUrl}/private-plugins/${privatePlugin.id}`;
        history.push(fieldUrl);
      }
    }, [data, selectFirst, history, baseUrl]);

    useEffect(() => {
      getPrivatePluginsByCodeGenerator(searchPhrase);
    }, [getPrivatePluginsByCodeGenerator, searchPhrase]);

    return (
      <div className={CLASS_NAME}>
        <VerticalNavigationItem
          icon="git_branch"
          to={`${baseUrl}/private-plugins/git-settings`}
        >
          <FlexItem itemsAlign={EnumItemsAlign.Center}>Git Settings</FlexItem>
        </VerticalNavigationItem>

        <NewPrivatePlugin
          onPrivatePluginAdd={handlePrivatePluginChange}
          resourceId={pluginRepositoryResource?.id}
        />
        <HorizontalRule />

        <SearchField
          label="search"
          placeholder="search"
          onChange={handleSearchChange}
        />

        {data &&
          Object.entries(data).map(([codeGenerator, privatePlugins]) => (
            <CollapsibleListItem
              initiallyExpanded
              icon={"code"}
              expandable
              childItems={
                <>
                  <VerticalNavigation>
                    {privatePlugins.map((privatePlugin) => (
                      <VerticalNavigationItem
                        key={privatePlugin.id}
                        icon="plugin"
                        to={`${baseUrl}/private-plugins/${privatePlugin.id}`}
                      >
                        <FlexItem
                          itemsAlign={EnumItemsAlign.Center}
                          end={
                            <EnabledIndicator enabled={privatePlugin.enabled} />
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
              <span>{codeGenerator} </span>&nbsp; Plugins
            </CollapsibleListItem>
          ))}

        {loading && <CircularProgress />}

        <Snackbar open={Boolean(error)} message={errorMessage} />
      </div>
    );
  }
);
