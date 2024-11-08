import { useCallback, useMemo, useState } from "react";
import { useAppContext } from "../context/appContext";
import {
  EnumCustomPropertyType,
  JsonPathStringFilter,
  JsonPathStringFilterItem,
} from "../models";
import { CustomPropertyFilter } from "./CustomPropertyFilter";
import {
  EnumButtonStyle,
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
  Text,
} from "@amplication/ui/design-system";
import CustomPropertyValueSelect from "./CustomPropertyValueSelect";
import { use } from "ast-types";

const CLASS_NAME = "custom-property-filters";

const FILTERABLE_TYPES = [
  EnumCustomPropertyType.Select,
  EnumCustomPropertyType.MultiSelect,
];

type Props = {
  onChange: (filters: JsonPathStringFilter | null) => void;
};

export const CustomPropertyFilters = ({ onChange }: Props) => {
  const { customPropertiesMap } = useAppContext();

  //he selected values for each filter
  const [filters, setFilters] = useState<Record<string, string>>(
    Object.keys(customPropertiesMap).reduce((acc, key) => {
      acc[key] = null;
      return acc;
    }, {})
  );

  //the filters that are currently visible
  const [visibleFilters, setVisibleFilters] = useState<string[]>([]);

  //set the selected value for a filter, recalculate the filters object, and call the onChange callback
  const setFilter = (propertyKey: string, value: string) => {
    setFilters((prevFilters) => {
      const newFilters = {
        ...prevFilters,
        [propertyKey]: value,
      };

      onFilterValueChanged(newFilters);

      return newFilters;
    });
  };

  const onFilterValueChanged = useCallback(
    (newFilters: Record<string, string>) => {
      const filterList: JsonPathStringFilterItem[] = Object.keys(
        newFilters
      ).map((key) => {
        if (!newFilters[key]) {
          return null;
        }

        return {
          path: key,
          equals:
            customPropertiesMap[key].type === EnumCustomPropertyType.Select
              ? newFilters[key]
              : undefined,
          arrayContains:
            customPropertiesMap[key].type === EnumCustomPropertyType.MultiSelect
              ? newFilters[key]
              : undefined,
        };
      });

      const activeFilters = filterList.filter((filter) => filter !== null);

      if (activeFilters.length === 0) {
        onChange(null);
      } else {
        onChange({
          matchAll: activeFilters,
        });
      }
    },
    [customPropertiesMap, onChange]
  );

  //add a filter to the visible filters
  const onAddFilter = useCallback(
    (propertyKey: string) => {
      setVisibleFilters((prevFilters) => [...prevFilters, propertyKey]);
      setFilters((prevFilters) => {
        const newFilters = {
          ...prevFilters,
          [propertyKey]: null,
        };

        onFilterValueChanged(newFilters);

        return newFilters;
      });
    },
    [onFilterValueChanged]
  );

  const onRemoveFilter = useCallback(
    (propertyKey: string) => {
      setVisibleFilters((prevFilters) =>
        prevFilters.filter((key) => key !== propertyKey)
      );
      setFilters((prevFilters) => {
        const newFilters = { ...prevFilters };
        delete newFilters[propertyKey];

        onFilterValueChanged(newFilters);

        return newFilters;
      });
    },
    [onFilterValueChanged]
  );

  //get the filterable properties that are not currently visible for the "add filter" menu
  const filterableProperties = useMemo(() => {
    return Object.values(customPropertiesMap).filter(
      (property) =>
        FILTERABLE_TYPES.includes(property.type) &&
        !visibleFilters.includes(property.key)
    );
  }, [customPropertiesMap, visibleFilters]);

  return (
    <FlexItem
      direction={EnumFlexDirection.Row}
      gap={EnumGapSize.Large}
      itemsAlign={EnumItemsAlign.Center}
      margin={EnumFlexItemMargin.Bottom}
      className={CLASS_NAME}
    >
      {visibleFilters.map((key) => (
        <CustomPropertyFilter
          key={key}
          customProperty={customPropertiesMap[key]}
          onChange={setFilter}
          onRemove={onRemoveFilter}
          selectedValue={filters[key]}
        />
      ))}

      {filterableProperties.length > 0 && (
        <SelectMenu
          title={
            <FlexItem
              gap={EnumGapSize.Small}
              itemsAlign={EnumItemsAlign.Center}
            >
              <Text
                textColor={EnumTextColor.Black20}
                textStyle={EnumTextStyle.Tag}
              >
                Add filter
              </Text>
            </FlexItem>
          }
          buttonStyle={EnumButtonStyle.Text}
        >
          <SelectMenuModal>
            <SelectMenuList>
              {filterableProperties.map((prop) => (
                <SelectMenuItem
                  closeAfterSelectionChange
                  key={prop.key}
                  itemData={prop.key}
                  onSelectionChange={onAddFilter}
                >
                  {prop.name}
                </SelectMenuItem>
              ))}
            </SelectMenuList>
          </SelectMenuModal>
        </SelectMenu>
      )}
    </FlexItem>
  );
};
