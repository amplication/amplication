import {
  EnumApiOperationTagStyle,
  EnumContentAlign,
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumItemsAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  HorizontalRule,
  SearchField,
  TabContentTitle,
  Text,
  Toggle,
} from "@amplication/ui/design-system";
import React, { useCallback } from "react";
import { useModulesContext } from "./modulesContext";
import {
  FlexEnd,
  FlexStart,
} from "@amplication/ui/design-system/components/FlexItem/FlexItem";
import "./ModulesHeader.scss";

type Props = {
  title: string;
  subTitle: string;
  hideApiToggle?: boolean;
  actions?: React.ReactNode;
};

const CLASS_NAME = "modules-header";

const ModulesHeader = React.memo(
  ({ title, subTitle, hideApiToggle, actions }: Props) => {
    const {
      displayMode,
      graphQlEnabled,
      restEnabled,
      setSearchPhrase,
      setDisplayMode,
    } = useModulesContext();

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
      (value: boolean) => {
        setDisplayMode(
          value ? EnumApiOperationTagStyle.REST : EnumApiOperationTagStyle.GQL
        );
      },
      [setDisplayMode]
    );

    const showApiToggle = !hideApiToggle && graphQlEnabled && restEnabled;

    return (
      <>
        <FlexItem start={<TabContentTitle title={title} subTitle={subTitle} />}>
          <FlexEnd direction={EnumFlexDirection.Row}>
            {actions}

            <SearchField
              label="search"
              placeholder="Search"
              onChange={handleSearchChange}
            />
          </FlexEnd>
        </FlexItem>
        <FlexItem>
          <FlexStart>
            {showApiToggle && (
              <FlexItem
                direction={EnumFlexDirection.Row}
                contentAlign={EnumContentAlign.Start}
                itemsAlign={EnumItemsAlign.Center}
              >
                <Text
                  textStyle={EnumTextStyle.Tag}
                  textColor={
                    displayMode === EnumApiOperationTagStyle.GQL
                      ? EnumTextColor.White
                      : EnumTextColor.Black20
                  }
                >
                  GraphQL API
                </Text>
                <div className={`${CLASS_NAME}__operation-toggle`}>
                  <Toggle
                    checked={displayMode === EnumApiOperationTagStyle.REST}
                    onValueChange={handleDisplayModeChange}
                  />
                </div>
                <Text
                  textStyle={EnumTextStyle.Tag}
                  textColor={
                    displayMode === EnumApiOperationTagStyle.REST
                      ? EnumTextColor.White
                      : EnumTextColor.Black20
                  }
                >
                  REST API
                </Text>
              </FlexItem>
            )}
          </FlexStart>
        </FlexItem>
        <HorizontalRule />
      </>
    );
  }
);

export default ModulesHeader;
