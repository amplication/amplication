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
import { ModuleActionListItem } from "./ModuleActionListItem";
import "./ToggleModule.scss";
import useModuleAction from "./hooks/useModuleAction";

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
    const {
      findModuleActions,
      findModuleActionsData: data,
      findModuleActionsLoading: loading,
    } = useModuleAction();

    const { getModuleData: moduleData, updateModule } = useModule(moduleId);

    const [enabledActions, setEnabledActions] = useState<boolean>(
      moduleData?.Module?.enabled || null
    );

    useEffect(() => {
      if (!moduleData) return;
      setEnabledActions(moduleData.Module.enabled);
    }, [moduleData, moduleData?.Module?.enabled]);

    const onEnableChanged = useCallback(
      (value: boolean) => {
        updateModule({
          variables: {
            where: {
              id: moduleId,
            },
            data: {
              description: moduleData.Module.description,
              displayName: moduleData.Module.description,
              name: moduleData.Module.name,
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
    }, [moduleId, searchPhrase, findModuleActions, resourceId]);

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
              disabled={disabled || !enabledActions}
            />
          ))}
        </List>
      </>
    );
  }
);

export default ModuleActionList;
