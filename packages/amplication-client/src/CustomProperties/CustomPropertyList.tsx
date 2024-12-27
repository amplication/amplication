import {
  CircularProgress,
  EnabledIndicator,
  EnumItemsAlign,
  EnumTextStyle,
  FlexItem,
  HorizontalRule,
  Icon,
  List,
  ListItem,
  SearchField,
  Snackbar,
  TabContentTitle,
  Text,
} from "@amplication/ui/design-system";
import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import * as models from "../models";
import { formatError } from "../util/error";
import { pluralize } from "../util/pluralize";
import useCustomProperties from "./hooks/useCustomProperties";
import NewCustomProperty from "./NewCustomProperty";

const CLASS_NAME = "custom-property-list";

export const CUSTOM_PROPERTY_TYPE_TO_LABEL_AND_ICON: {
  [key in models.EnumCustomPropertyType]: {
    label: string;
    icon: string;
  };
} = {
  /**@todo: update the icons for each type */
  [models.EnumCustomPropertyType.Text]: {
    label: "Text",
    icon: "type",
  },
  [models.EnumCustomPropertyType.Link]: {
    label: "Link",
    icon: "link",
  },
  [models.EnumCustomPropertyType.Select]: {
    label: "Select",
    icon: "check_square",
  },
  [models.EnumCustomPropertyType.MultiSelect]: {
    label: "Multi Select",
    icon: "multi_select_option_set",
  },
};

export const CustomPropertyList = React.memo(() => {
  const { currentWorkspace } = useAppContext();

  const baseUrl = `/${currentWorkspace?.id}/settings`;

  const {
    setSearchPhrase,
    findCustomPropertiesData: data,
    findCustomPropertiesError: error,
    findCustomPropertiesLoading: loading,
  } = useCustomProperties();

  const handleSearchChange = useCallback(
    (value) => {
      setSearchPhrase(value);
    },
    [setSearchPhrase]
  );
  const history = useHistory();

  const errorMessage = formatError(error);

  const handleCustomPropertyChange = useCallback(
    (customProperty: models.CustomProperty) => {
      const fieldUrl = `${baseUrl}/properties/${customProperty.id}`;
      history.push(fieldUrl);
    },
    [history, baseUrl]
  );

  return (
    <div className={CLASS_NAME}>
      <TabContentTitle title="Catalog Properties" />
      <FlexItem
        itemsAlign={EnumItemsAlign.End}
        end={
          <SearchField
            label="search"
            placeholder="search"
            onChange={handleSearchChange}
          />
        }
      >
        <Text textStyle={EnumTextStyle.Tag}>
          {data?.customProperties.length || "0"}{" "}
          {pluralize(data?.customProperties.length, "Property", "Properties")}
        </Text>
        {loading && <CircularProgress />}
      </FlexItem>
      <HorizontalRule />
      <List
        headerContent={
          <NewCustomProperty
            //disabled={!data?.customProperties}
            onCustomPropertyAdd={handleCustomPropertyChange}
          />
        }
      >
        {data?.customProperties?.map((customProperty) => (
          <ListItem
            to={`${baseUrl}/properties/${customProperty.id}`}
            key={customProperty.id}
            start={
              <Icon
                icon={
                  CUSTOM_PROPERTY_TYPE_TO_LABEL_AND_ICON[customProperty.type]
                    .icon
                }
              />
            }
          >
            <FlexItem
              singeChildWithEllipsis
              itemsAlign={EnumItemsAlign.Center}
              end={<EnabledIndicator enabled={customProperty.enabled} />}
            >
              <span>{customProperty.name}</span>
            </FlexItem>
          </ListItem>
        ))}
      </List>
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </div>
  );
});
