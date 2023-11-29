import { SelectField, SelectFieldProps } from "@amplication/ui/design-system";
import { EnumModuleActionGqlOperation } from "../models";

type Props = Omit<SelectFieldProps, "options">;

const qlOperationMapping = [
  {
    label: "mutation",
    value: EnumModuleActionGqlOperation.Mutation,
  },
  {
    label: "query",
    value: EnumModuleActionGqlOperation.Query,
  },
];

const GqlOperationSelectField = ({ ...props }: Props) => {
  return <SelectField {...props} options={qlOperationMapping} />;
};

export default GqlOperationSelectField;
