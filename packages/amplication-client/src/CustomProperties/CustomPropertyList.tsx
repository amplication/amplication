import {
  CircularProgress,
  EnabledIndicator,
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextStyle,
  FlexItem,
  HorizontalRule,
  SearchField,
  Snackbar,
  Text,
} from "@amplication/ui/design-system";
import { isEmpty } from "lodash";
import React, { useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import InnerTabLink from "../Layout/InnerTabLink";
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

type Props = {
  selectFirst?: boolean;
};

export const CustomPropertyList = React.memo(
  ({ selectFirst = false }: Props) => {
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

    useEffect(() => {
      if (selectFirst && data && !isEmpty(data.customProperties)) {
        const customProperty = data.customProperties[0];
        const fieldUrl = `${baseUrl}/properties/${customProperty.id}`;
        history.push(fieldUrl);
      }
    }, [data, selectFirst, history, baseUrl]);

    return (
      <div className={CLASS_NAME}>
        <FlexItem
          margin={EnumFlexItemMargin.Bottom}
          end={loading && <CircularProgress centerToParent />}
        >
          <Text textStyle={EnumTextStyle.Tag}>
            {data?.customProperties.length || "0"}{" "}
            {pluralize(data?.customProperties.length, "Property", "Properties")}
          </Text>
        </FlexItem>
        {
          <NewCustomProperty
            disabled={!data?.customProperties}
            onCustomPropertyAdd={handleCustomPropertyChange}
          />
        }
        <HorizontalRule />
        <SearchField
          label="search"
          placeholder="search"
          onChange={handleSearchChange}
        />

        <FlexItem
          margin={EnumFlexItemMargin.Top}
          direction={EnumFlexDirection.Column}
          itemsAlign={EnumItemsAlign.Stretch}
          gap={EnumGapSize.None}
        >
          {data?.customProperties?.map((customProperty) => (
            <InnerTabLink
              icon={
                CUSTOM_PROPERTY_TYPE_TO_LABEL_AND_ICON[customProperty.type].icon
              }
              to={`${baseUrl}/properties/${customProperty.id}`}
              key={customProperty.id}
            >
              <FlexItem
                singeChildWithEllipsis
                itemsAlign={EnumItemsAlign.Center}
                end={<EnabledIndicator enabled={customProperty.enabled} />}
              >
                <span>{customProperty.name}</span>
              </FlexItem>
            </InnerTabLink>
          ))}
        </FlexItem>
        <Snackbar open={Boolean(error)} message={errorMessage} />
      </div>
    );
  }
);
