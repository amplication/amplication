import { SelectField, SelectFieldProps } from "@amplication/ui/design-system";
import { useMemo } from "react";
import useBlueprints from "./hooks/useBlueprints";
import { EnumResourceType } from "../models";
import { resourceThemeMap } from "../Resource/constants";

type Props = Omit<SelectFieldProps, "options"> & {
  useKeyAsValue?: boolean;
  onChange?: (value: string) => void;
};

const BlueprintSelectField = (props: Props) => {
  const { findBlueprintsData } = useBlueprints();
  const { useKeyAsValue, ...rest } = props;

  const options = useMemo(() => {
    return findBlueprintsData?.blueprints
      .filter((blueprint) => blueprint.enabled)
      .map((blueprint) => ({
        value: useKeyAsValue ? blueprint.key : blueprint.id,
        label: blueprint.name,
        enabled: blueprint.enabled,
        color:
          blueprint.color || resourceThemeMap[EnumResourceType.Component].color,
      }));
  }, [findBlueprintsData?.blueprints, useKeyAsValue]);

  return <SelectField {...rest} options={options} />;
};

export default BlueprintSelectField;
