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
  restTagType?: EnumRestApiOperationTagType;
  gqlTagType?: EnumGqlApiOperationTagType;
  tagStyle: EnumApiOperationTagStyle;
};

const CLASS_NAME = "amp-api-operation-tag";

export function ApiOperationTag({
  className,
  restTagType,
  gqlTagType,
  tagStyle,
}: Props) {
  const tagClass =
    tagStyle === EnumApiOperationTagStyle.REST
      ? `${CLASS_NAME}--${restTagType}`
      : `${CLASS_NAME}--${gqlTagType}`;

  const tagName =
    tagStyle === EnumApiOperationTagStyle.REST ? restTagType : gqlTagType;

  return (
    <span className={classNames(CLASS_NAME, tagClass, className)}>
      {tagName}
    </span>
  );
}
