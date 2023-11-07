import { SelectField, SelectFieldProps } from "@amplication/ui/design-system";
import { EnumModuleActionGqlOperation } from "../models";

type Props = Omit<SelectFieldProps, "options">;

type gqlOperationSelectFieldDic = {
  key: string;
  operation: EnumModuleActionGqlOperation;
};

const qlOperationMapping: gqlOperationSelectFieldDic[] = [
  {
    key: "mutation",
    operation: EnumModuleActionGqlOperation.Mutation,
  },
  {
    key: "query",
    operation: EnumModuleActionGqlOperation.Query,
  },
];

const GqlOperationSelectField = ({ ...props }: Props) => {
  const res = qlOperationMapping.map((operation) => ({
    value: operation.operation,
    label: operation.key,
  }));

  return <SelectField {...props} options={res} />;
};

export default GqlOperationSelectField;
