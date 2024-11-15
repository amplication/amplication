import { SelectField, SelectFieldProps } from "@amplication/ui/design-system";
import { useMemo } from "react";
import useBlueprints from "./hooks/useBlueprints";
import { EnumResourceType } from "../models";
import { resourceThemeMap } from "../Resource/constants";

type Props = Omit<SelectFieldProps, "options">;

const BlueprintSelectField = (props: Props) => {
  const { findBlueprintsData } = useBlueprints();

  const options = useMemo(() => {
    return findBlueprintsData?.blueprints.map((blueprint) => ({
      value: blueprint.id,
      label: blueprint.name,
      color:
        blueprint.color || resourceThemeMap[EnumResourceType.Component].color,
    }));
  }, [findBlueprintsData]);

  return <SelectField {...props} options={options} />;
};

export default BlueprintSelectField;
