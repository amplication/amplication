import { useMemo, useState } from "react";
import { useAppContext } from "../context/appContext";
import {
  EnumCustomPropertyType,
  JsonPathStringFilter,
  JsonPathStringFilterItem,
} from "../models";
import { CustomPropertyFilter } from "./CustomPropertyFilter";
import {
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumGapSize,
  EnumItemsAlign,
  FlexItem,
} from "@amplication/ui/design-system";

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
  const [filters, setFilters] = useState<Record<string, string>>(
    Object.keys(customPropertiesMap).reduce((acc, key) => {
      acc[key] = null;
      return acc;
    }, {})
  );

  const setFilter = (propertyKey: string, value: string) => {
    setFilters((prevFilters) => {
      const newFilters = {
        ...prevFilters,
        [propertyKey]: value,
      };

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

      return newFilters;
    });
  };

  const filterableProperties = useMemo(() => {
    return Object.values(customPropertiesMap).filter((property) =>
      FILTERABLE_TYPES.includes(property.type)
    );
  }, [customPropertiesMap]);

  return (
    <FlexItem
      direction={EnumFlexDirection.Row}
      gap={EnumGapSize.Large}
      itemsAlign={EnumItemsAlign.Center}
      margin={EnumFlexItemMargin.Bottom}
      className={CLASS_NAME}
    >
      {filterableProperties.map((property) => (
        <CustomPropertyFilter
          key={property.id}
          customProperty={property}
          onChange={setFilter}
          selectedValue={filters[property.key]}
        />
      ))}
    </FlexItem>
  );
};
