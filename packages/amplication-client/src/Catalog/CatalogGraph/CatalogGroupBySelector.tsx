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
    fieldKey: "Project",
    namePath: "project.name",
    idPath: "project.id",
  },
  blueprint: {
    fieldKey: "Blueprint",
    namePath: "blueprint.name",
    idPath: "blueprint.id",
  },
  gitOrganization: {
    fieldKey: "Git Organization",
    namePath: "gitRepository.gitOrganization.name",
    idPath: "gitRepository.gitOrganization.id",
  },
  gitRepo: {
    fieldKey: "Git Repository",
    namePath: "gitRepository.name",
    idPath: "gitRepository.id",
  },
  serviceTemplate: {
    fieldKey: "Service Templates",
    namePath: "serviceTemplate.name",
    idPath: "serviceTemplate.id",
  },
};

type Props = {
  onChange: (groupByFields: GroupByField[]) => void;
};

export const CatalogGroupBySelector = ({ onChange }: Props) => {
  const [selectedValue, setSelectedValue] = useState<string[]>([]);

  const { customPropertiesMap } = useCustomPropertiesMap();

  const options = useMemo(() => {
    const fixed = Object.keys(FIELDS).map((key) => {
      const field = FIELDS[key];
      return {
        value: key,
        label: field.fieldKey,
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

  const handleChange = useCallback(
    (value) => {
      setSelectedValue(value);

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
        selectedValue={selectedValue}
        onChange={handleChange}
        isMulti={true}
        buttonProps={{
          buttonStyle: EnumButtonStyle.Text,
        }}
      />
    </FlexItem>
  );
};
