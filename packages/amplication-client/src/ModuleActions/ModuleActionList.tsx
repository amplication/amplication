import {
  CircularProgress,
  EnumApiOperationTagStyle,
  EnumItemsAlign,
  EnumListStyle,
  EnumTextColor,
  EnumTextStyle,
  EnumTextWeight,
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
  disabled?: boolean;
};
const ModuleActionList = React.memo(
  ({ moduleId, resourceId, displayMode, searchPhrase, disabled }: Props) => {
    const [error, setError] = useState<Error>();

    const {
      findModuleActions,
      findModuleActionsData: data,
      findModuleActionsError: errorLoading,
      findModuleActionsLoading: loading,
    } = useModuleAction();

    const { getModuleData: moduleData, updateModule } = useModule(moduleId);

    const [enabledActions, setEnabledActions] = useState<boolean>(
      moduleData?.module?.enabled || null
    );

    useEffect(() => {
      if (!moduleData) return;
      setEnabledActions(moduleData.module.enabled);
    }, [moduleData, moduleData?.module?.enabled]);

    const onEnableChanged = useCallback(
      (value: boolean) => {
        updateModule({
          variables: {
            where: {
              id: moduleId,
            },
            data: {
              description: moduleData.module.description,
              displayName: moduleData.module.description,
              name: moduleData.module.name,
              enabled: value,
            },
          },
        }).catch(console.error);
      },
      [moduleId, moduleData, updateModule]
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
                    disabled={disabled}
                  ></Toggle>
                </div>
              }
            >
              <Text
                textStyle={EnumTextStyle.Normal}
                textColor={EnumTextColor.White}
                textWeight={EnumTextWeight.Bold}
              >
                {moduleData?.module.name}
              </Text>
              <Text textStyle={EnumTextStyle.Description}>
                {moduleData?.module.description}
              </Text>
            </FlexItem>
          }
        >
          {data?.moduleActions?.map((action) => (
            <ModuleActionListItem
              key={action.id}
              module={moduleData?.module}
              moduleAction={action}
              tagStyle={displayMode}
              disabled={disabled || !enabledActions}
            />
          ))}
        </List>
      </>
    );
  }
);

export default ModuleActionList;
