import {
  CircularProgress,
  EnumApiOperationTagStyle,
  EnumItemsAlign,
  EnumListStyle,
  EnumTextColor,
  EnumTextStyle,
  EnumTextWeight,
  EnumToggleStyle,
  FlexItem,
  List,
  ListItem,
  Text,
  Toggle,
} from "@amplication/ui/design-system";
import React, { useCallback, useEffect, useState } from "react";
import useModule from "../Modules/hooks/useModule";
import * as models from "../models";
import { ModuleActionListItem } from "./ModuleActionListItem";
import useModuleAction from "./hooks/useModuleAction";

const DATE_CREATED_FIELD = "createdAt";

type Props = {
  module: models.Module;
  displayMode: EnumApiOperationTagStyle;
  searchPhrase: string;
  disabled?: boolean;
};
const ModuleActionList = React.memo(
  ({ module, displayMode, searchPhrase, disabled }: Props) => {
    const {
      findModuleActions,
      findModuleActionsData: data,
      findModuleActionsLoading: loading,
    } = useModuleAction();

    const moduleId = module.id;
    const resourceId = module.resourceId;

    const { updateModule } = useModule(moduleId);

    const [enabledActions, setEnabledActions] = useState<boolean>(
      module?.enabled || null
    );

    useEffect(() => {
      if (!module) return;
      setEnabledActions(module.enabled);
    }, [module]);

    const onEnableChanged = useCallback(
      (value: boolean) => {
        updateModule({
          variables: {
            where: {
              id: moduleId,
            },
            data: {
              enabled: value,
            },
          },
        }).catch(console.error);
      },
      [moduleId, updateModule]
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
        <List
          listStyle={EnumListStyle.Default}
          headerContent={
            <FlexItem
              itemsAlign={EnumItemsAlign.Center}
              start={
                <Toggle
                  toggleStyle={EnumToggleStyle.Green}
                  name={"enabled"}
                  onValueChange={onEnableChanged}
                  checked={enabledActions}
                  disabled={disabled}
                ></Toggle>
              }
            >
              <Text
                textStyle={EnumTextStyle.Normal}
                textColor={EnumTextColor.White}
              >
                All actions in module {module.name}
              </Text>
            </FlexItem>
          }
        >
          {data?.moduleActions?.length ? (
            data?.moduleActions?.map((action) => (
              <ModuleActionListItem
                key={action.id}
                module={module}
                moduleAction={action}
                tagStyle={displayMode}
                disabled={disabled || !enabledActions}
              />
            ))
          ) : (
            <ListItem>
              {loading ? (
                <CircularProgress centerToParent />
              ) : (
                <Text textStyle={EnumTextStyle.Description}>
                  No actions found
                </Text>
              )}
            </ListItem>
          )}
        </List>
      </>
    );
  }
);

export default ModuleActionList;
