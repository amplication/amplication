import React, { useMemo } from "react";
import { capitalCase } from "capital-case";
import {
  SelectField,
  Props as SelectFieldProps,
} from "../Components/SelectField";

type Props = Omit<SelectFieldProps, "options"> & {
  applicationId: string;
  options: string[];
};

const EnumSelectField = ({ applicationId, options, ...props }: Props) => {
  const listOptions = useMemo(() => {
    return options
      ? options.map((item) => ({
          value: item,
          label: capitalCase(item),
        }))
      : [];
  }, [options]);

  return <SelectField {...props} options={listOptions} />;
};

export default EnumSelectField;
