import React from "react";

import "./CodeGeneratorImage.scss";
import * as models from "../models";
import classNames from "classnames";

export type Props = {
  codeGenerator: models.EnumCodeGenerator;
  size?: "small" | "medium" | "large";
};

const CLASS_NAME = "code-generator-image";

export const CodeGeneratorImage = ({
  codeGenerator,
  size = "small",
}: Props) => {
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
