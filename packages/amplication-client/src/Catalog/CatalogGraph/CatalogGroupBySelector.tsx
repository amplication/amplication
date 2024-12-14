import {
  EnumButtonStyle,
  EnumFlexDirection,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextColor,
  FlexItem,
  Icon,
  SelectPanel,
  Tooltip,
} from "@amplication/ui/design-system";
import { useCallback, useMemo, useState } from "react";
import { GroupByField } from "./types";
import useCustomPropertiesMap from "../../CustomProperties/hooks/useCustomPropertiesMap";
import * as models from "../../models";

const FIELDS: { [key: string]: GroupByField } = {
  project: {
    fieldKey: "project",
    fieldName: "Project",
    namePath: "project.name",
    idPath: "project.id",
  },
  blueprint: {
    fieldKey: "blueprint",
    fieldName: "Blueprint",
    namePath: "blueprint.name",
    idPath: "blueprint.id",
  },
  gitOrganization: {
    fieldKey: "gitOrganization",
    fieldName: "Git Organization",
    namePath: "gitRepository.gitOrganization.name",
    idPath: "gitRepository.gitOrganization.id",
  },
  gitRepo: {
    fieldKey: "gitRepo",
    fieldName: "Git Repository",
    namePath: "gitRepository.name",
    idPath: "gitRepository.id",
  },
  serviceTemplate: {
    fieldKey: "serviceTemplate",
    fieldName: "Service Templates",
    namePath: "serviceTemplate.name",
    idPath: "serviceTemplate.id",
  },
};

type Props = {
  onChange: (groupByFields: GroupByField[]) => void;
  selectedValue: GroupByField[];
};

export const CatalogGroupBySelector = ({ onChange, selectedValue }: Props) => {
  const { customPropertiesMap } = useCustomPropertiesMap();

  const options = useMemo(() => {
    const fixed = Object.keys(FIELDS).map((key) => {
      const field = FIELDS[key];
      return {
        value: key,
        label: field.fieldName,
      };
    });

    const custom = Object.values(customPropertiesMap)

      .filter(
        (property) =>
          (property.type === models.EnumCustomPropertyType.Select ||
            property.type === models.EnumCustomPropertyType.MultiSelect) &&
          property.options &&
          property.options.length > 0
      )

      .map((property) => {
        return {
          value: property.key,
          label: property.name,
        };
      });

    return [...fixed, ...custom];
  }, [customPropertiesMap]);

  const selectedKeys = useMemo(() => {
    return selectedValue?.map((field) => field.fieldKey) || [];
  }, [selectedValue]);

  const handleChange = useCallback(
    (value) => {
      const selectedFields: GroupByField[] = value.map((field) => {
        if (customPropertiesMap[field]) {
          return {
            fieldKey: field,
            namePath: `properties.${field}`,
            idPath: `properties.${field}`,
          };
        }

        return FIELDS[field];
      });
      onChange(selectedFields);
    },
    [customPropertiesMap, onChange]
  );

  return (
    <FlexItem
      direction={EnumFlexDirection.Row}
      gap={EnumGapSize.Large}
      itemsAlign={EnumItemsAlign.Center}
    >
      <Tooltip title="Group by" direction="s">
        <Icon icon="lookup" color={EnumTextColor.Black20} />
      </Tooltip>

      <SelectPanel
        label={"Group By"}
        options={options}
        selectedValue={selectedKeys}
        onChange={handleChange}
        isMulti={true}
        buttonProps={{
          buttonStyle: EnumButtonStyle.Text,
        }}
      />
    </FlexItem>
  );
};
