import React, { useMemo } from "react";
import { capitalCase } from "capital-case";
import { SelectField, SelectFieldProps } from "@amplication/design-system";

type Props = Omit<SelectFieldProps, "options"> & {
  options: string[];
};

const EnumSelectField = ({ options, ...props }: Props) => {
  const listOptions = useMemo(
    () =>
      options.map((item) => ({
        value: item,
        label: capitalCase(item),
      })),
    [options]
  );

  return <SelectField {...props} options={listOptions} />;
};

export default EnumSelectField;
