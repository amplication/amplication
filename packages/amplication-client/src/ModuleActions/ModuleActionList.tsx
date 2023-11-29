import {
  CircularProgress,
  EnumApiOperationTagStyle,
  EnumItemsAlign,
  EnumListStyle,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  List,
  Text,
  Toggle,
} from "@amplication/ui/design-system";
import React, { useCallback, useEffect, useState } from "react";
import useModule from "../Modules/hooks/useModule";
import * as models from "../models";
import { formatError } from "../util/error";
import { ModuleActionListItem } from "./ModuleActionListItem";
import useModuleAction from "./hooks/useModuleAction";
import "./ToggleModule.scss";

const DATE_CREATED_FIELD = "createdAt";

type Props = {
  moduleId: string;
  resourceId: string;
  displayMode: EnumApiOperationTagStyle;
  searchPhrase: string;
};
const ModuleActionList = React.memo(
  ({ moduleId, resourceId, displayMode, searchPhrase }: Props) => {
    const [error, setError] = useState<Error>();

    const {
      findModuleActions,
      findModuleActionsData: data,
      findModuleActionsError: errorLoading,
      findModuleActionsLoading: loading,
    } = useModuleAction();

    const { getModule, getModuleData: moduleData, updateModule } = useModule();

    const [enabledActions, setEnabledActions] = useState<boolean>(
      moduleData?.Module.enabled || null
    );

    useEffect(() => {
      if (!moduleData) return;
      setEnabledActions(moduleData.Module.enabled);
    }, [moduleData, moduleData?.Module?.enabled]);

    useEffect(() => {
      if (!moduleData) return;
      updateModule({
        variables: {
          where: {
            id: moduleId,
          },
          data: {
            description: moduleData.Module.description,
            displayName: moduleData.Module.description,
            name: moduleData.Module.name,
            enabled: enabledActions,
          },
        },
      }).catch(console.error);
    }, [enabledActions, setEnabledActions, moduleId]);

    const onEnableChanged = useCallback(
      (value: boolean) => {
        setEnabledActions(value);
      },
      [setEnabledActions]
    );

    useEffect(() => {
      findModuleActions({
        variables: {
          where: {
            parentBlock: { id: moduleId },
            resource: { id: resourceId },
            displayName:
              searchPhrase !== ""
                ? {
                    contains: searchPhrase,
                    mode: models.QueryMode.Insensitive,
                  }
                : undefined,
          },
          orderBy: {
            [DATE_CREATED_FIELD]: models.SortOrder.Asc,
          },
        },
      });

      getModule({
        variables: {
          moduleId,
        },
      }).catch(console.error);
    }, [moduleId, searchPhrase, findModuleActions]);

    const errorMessage =
      formatError(errorLoading) || (error && formatError(error));

    return (
      <>
        {loading && <CircularProgress centerToParent />}
        <List
          listStyle={EnumListStyle.Dark}
          collapsible
          headerContent={
            <FlexItem
              itemsAlign={EnumItemsAlign.Center}
              start={
                <div className="module-toggle-field">
                  <Toggle
                    name={"enabled"}
                    onValueChange={onEnableChanged}
                    checked={enabledActions}
                  ></Toggle>
                </div>
              }
            >
              <Text
                textStyle={EnumTextStyle.Normal}
                textColor={EnumTextColor.White}
              >
                {moduleData?.Module.name}
              </Text>
              <Text textStyle={EnumTextStyle.Description}>
                {moduleData?.Module.description}
              </Text>
            </FlexItem>
          }
        >
          {data?.ModuleActions?.map((action) => (
            <ModuleActionListItem
              key={action.id}
              module={moduleData?.Module}
              moduleAction={action}
              tagStyle={displayMode}
              disabled={!enabledActions}
            />
          ))}
        </List>
      </>
    );
  }
);

export default ModuleActionList;
