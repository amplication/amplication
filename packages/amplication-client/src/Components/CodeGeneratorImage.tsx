import React from "react";

import "./CodeGeneratorImage.scss";
import * as models from "../models";
import classNames from "classnames";

export type Props = {
  resource: models.Resource;
  size?: "small" | "medium" | "large";
};

const CLASS_NAME = "code-generator-image";

export const CodeGeneratorImage = ({ resource, size = "small" }: Props) => {
  if (!resource) {
    return null;
  }

  const { codeGenerator, resourceType } = resource;

  if (!codeGenerator) {
    return null;
  }

  if (
    ![
      models.EnumResourceType.Service,
      models.EnumResourceType.ServiceTemplate,
    ].includes(resourceType)
  ) {
    return null;
  }

  return (
    <span className={classNames(CLASS_NAME, `${CLASS_NAME}--${size}`)}>
      <span
        className={classNames(
          `${CLASS_NAME}__icon`,
          `${CLASS_NAME}--${codeGenerator.toString().toLowerCase()}`
        )}
      />
    </span>
  );
};
