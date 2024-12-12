import {
  DataGridColumn,
  EnumButtonStyle,
  SelectPanel,
} from "@amplication/ui/design-system";
import { useCallback, useState } from "react";
import { Resource } from "../../../models";
import { GroupByField } from "../types";

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
  domain: {
    fieldKey: "Domain",
    namePath: "properties.DOMAIN",
    idPath: "properties.DOMAIN",
  },
};

type Props = {
  onChange: (groupByFields: GroupByField[]) => void;
  columns?: DataGridColumn<Resource>[];
};

export const CatalogGroupBySelector = ({ onChange }: Props) => {
  const [selectedValue, setSelectedValue] = useState<string[]>([]);

  const options = Object.keys(FIELDS).map((key) => {
    const field = FIELDS[key];
    return {
      value: key,
      label: field.fieldKey,
    };
  });

  const handleChange = useCallback(
    (value) => {
      setSelectedValue(value);

      const selectedFields = value.map((field) => {
        return FIELDS[field];
      });
      onChange(selectedFields);
    },
    [onChange]
  );

  return (
    <div>
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
    </div>
  );
};
