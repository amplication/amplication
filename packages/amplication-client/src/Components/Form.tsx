import React from "react";
import { Form as FormikForm, FormikFormProps } from "formik";
import classNames from "classnames";

import "./Form.scss";

type Props = FormikFormProps & {
  childrenAsBlocks?: boolean;
};

export const Form = (props: Props) => {
  const { childrenAsBlocks, className, ...rest } = props;

  return (
    <FormikForm
      {...rest}
      className={classNames("amp-form", className, {
        "amp-form--children-as-blocks": childrenAsBlocks,
      })}
    />
  );
};
