import {
  EnumApiOperationTagStyle,
  EnumContentAlign,
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumItemsAlign,
  FlexItem,
  SearchField,
  TabContentTitle,
  Toggle,
} from "@amplication/ui/design-system";
import React, { useCallback, useEffect, useState } from "react";

import { match } from "react-router-dom";
import { AppRouteProps } from "../routes/routesUtil";
import ModuleActionList from "./ModuleActionList";
import NewModuleAction from "./NewModuleAction";
import useModule from "../Modules/hooks/useModule";
import * as models from "../models";
import { useQuery } from "@apollo/client";
import { GET_RESOURCE_SETTINGS } from "../Resource/resourceSettings/GenerationSettingsForm";
import "./ToggleModule.scss";

const DATE_CREATED_FIELD = "createdAt";

type Props = AppRouteProps & {
  match: match<{
    resource: string;
    module?: string;
  }>;
};
const ModuleActions = React.memo(({ match }: Props) => {
  const { module: moduleId, resource: resourceId } = match.params;
  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [error, setError] = useState<Error>();

  const [displayMode, setDisplayMode] = useState<EnumApiOperationTagStyle>(
    EnumApiOperationTagStyle.REST
  );

  const { data, error: serviceSettingsError } = useQuery<{
    serviceSettings: models.ServiceSettings;
  }>(GET_RESOURCE_SETTINGS, {
    variables: {
      id: resourceId,
    },
  });

  useEffect(() => {
    if (!data) return;
    if (data.serviceSettings.serverSettings.generateRestApi) {
      setDisplayMode(EnumApiOperationTagStyle.REST);
      return;
    }

    if (data.serviceSettings.serverSettings.generateGraphQL) {
      setDisplayMode(EnumApiOperationTagStyle.GQL);
    }
  }, [setDisplayMode, data]);

  let timeout;

  const handleSearchChange = useCallback(
    (value) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        setSearchPhrase(value);
      }, 750);
    },
    [setSearchPhrase, timeout]
  );

  const handleDisplayModeChange = useCallback(
    (checked: boolean) => {
      const value = checked
        ? EnumApiOperationTagStyle.REST
        : EnumApiOperationTagStyle.GQL;

      setDisplayMode(value);
    },
    [displayMode]
  );

  const { findModulesData: moduleListData } = useModule();
  const generateGraphQlAndRestApi =
    data?.serviceSettings?.serverSettings?.generateRestApi &&
    data?.serviceSettings?.serverSettings?.generateGraphQL;

  return (
    <>
      <>
        <div className="module-toggle-field__search-field">
          <SearchField
            label="search"
            placeholder="Search"
            onChange={handleSearchChange}
          />
        </div>

        <FlexItem
          itemsAlign={EnumItemsAlign.Center}
          margin={EnumFlexItemMargin.Top}
          start={
            <TabContentTitle
              title="Module Actions"
              subTitle="Actions are used to perform operations on resources, with or without API endpoints."
            />
          }
          // end={<NewModuleAction resourceId={resourceId} moduleId={moduleId} />} todo: return in phase 2
        ></FlexItem>

        {generateGraphQlAndRestApi && (
          <FlexItem
            direction={EnumFlexDirection.Row}
            contentAlign={EnumContentAlign.Start}
            itemsAlign={EnumItemsAlign.Normal}
          >
            GraphQL API
            <div className={`module-toggle-field__operation-toggle`}>
              <Toggle
                checked={displayMode === EnumApiOperationTagStyle.REST}
                onValueChange={handleDisplayModeChange}
              />
            </div>
            REST API
          </FlexItem>
        )}

        {moduleId ? (
          <FlexItem margin={EnumFlexItemMargin.Top}>
            <ModuleActionList
              moduleId={moduleId}
              resourceId={resourceId}
              searchPhrase={searchPhrase}
              displayMode={displayMode}
            />
          </FlexItem>
        ) : (
          moduleListData?.Modules.map((module) => (
            <FlexItem key={module.id} margin={EnumFlexItemMargin.Top}>
              <ModuleActionList
                moduleId={module.id}
                resourceId={resourceId}
                searchPhrase={searchPhrase}
                displayMode={displayMode}
              />
            </FlexItem>
          ))
        )}
      </>
    </>
  );
});

export default ModuleActions;
