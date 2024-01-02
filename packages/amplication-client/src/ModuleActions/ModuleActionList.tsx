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
  ListItem,
  Text,
  Toggle,
} from "@amplication/ui/design-system";
import React, { useCallback, useEffect, useState } from "react";
import * as models from "../models";
import { ModuleActionListItem } from "./ModuleActionListItem";
import NewModuleAction from "./NewModuleAction";
import useModuleAction from "./hooks/useModuleAction";
import useModule from "../Modules/hooks/useModule";

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
      findModuleActionRefetch: refetch,
    } = useModuleAction();

    const moduleId = module.id;
    const resourceId = module.resourceId;

    const { updateModule } = useModule(moduleId);

    const [enabledActions, setEnabledActions] = useState<boolean>(
      module?.enabled || null
    );

    const onActionCreated = useCallback(() => {
      refetch();
    }, [refetch]);

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
      [moduleId, module, updateModule]
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
              end={
                <NewModuleAction
                  moduleId={moduleId}
                  resourceId={resourceId}
                  onActionCreated={onActionCreated}
                />
              }
            >
              <Text
                textStyle={EnumTextStyle.Normal}
                textColor={EnumTextColor.White}
                textWeight={EnumTextWeight.Bold}
              >
                {module.name}
              </Text>
              <Text textStyle={EnumTextStyle.Description}>
                {module.description}
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
              <Text textStyle={EnumTextStyle.Description}>
                No actions found
              </Text>
            </ListItem>
          )}
        </List>
      </>
    );
  }
);

export default ModuleActionList;
