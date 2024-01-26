import {
  EnumApiOperationTagStyle,
  EnumContentAlign,
  EnumFlexDirection,
  EnumItemsAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  SearchField,
  TabContentTitle,
  Text,
  Toggle,
} from "@amplication/ui/design-system";
import React, { useCallback } from "react";
import { useModulesContext } from "./modulesContext";

const CLASS_NAME = "module-actions";

type Props = {
  title: string;
  subTitle: string;
};

const ModulesHeader = React.memo(({ title, subTitle }: Props) => {
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

  const showApiToggle = graphQlEnabled && restEnabled;

  return (
    <>
      <FlexItem
        start={<TabContentTitle title={title} subTitle={subTitle} />}
        end={
          <SearchField
            label="search"
            placeholder="Search"
            onChange={handleSearchChange}
          />
        }
      ></FlexItem>
      {showApiToggle && (
        <FlexItem
          direction={EnumFlexDirection.Row}
          className={`${CLASS_NAME}__api-toggle`}
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
          <div className={`module-toggle-field__operation-toggle`}>
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
    </>
  );
});

export default ModulesHeader;
