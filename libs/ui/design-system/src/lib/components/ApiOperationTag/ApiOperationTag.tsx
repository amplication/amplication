import classNames from "classnames";
import "./ApiOperationTag.scss";

export enum EnumRestApiOperationTagType {
  Get = "get",
  Post = "post",
  Put = "put",
  Patch = "patch",
  Delete = "delete",
  Head = "head",
  Options = "options",
  Trace = "trace",
}

export enum EnumGqlApiOperationTagType {
  Mutation = "mutation",
  Query = "query",
}

export enum EnumApiOperationTagStyle {
  REST = "Rest",
  GQL = "Gql",
}

export type Props = {
  className?: string;
  apiTagOperation: EnumRestApiOperationTagType | EnumGqlApiOperationTagType;
};

const CLASS_NAME = "amp-api-operation-tag";

export function ApiOperationTag({ className, apiTagOperation }: Props) {
  const tagClass = `${CLASS_NAME}--${apiTagOperation}`;

  return (
    <span className={classNames(CLASS_NAME, tagClass, className)}>
      {apiTagOperation}
    </span>
  );
}
