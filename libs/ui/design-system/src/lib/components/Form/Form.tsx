import React from "react";
import { Form as FormikForm, FormikFormProps } from "formik";
import classNames from "classnames";

import "./Form.scss";

/** The display style of the form */
export enum EnumFormStyle {
  /** All fields takes 100% of the parent width with label on top */
  Default = "default",
  /** The form is limited in width, and the fields are next to the label */
  Horizontal = "horizontal",
}

export type Props = FormikFormProps & {
  childrenAsBlocks?: boolean;
  formStyle?: EnumFormStyle;
  formHeaderContent?: React.ReactNode;
  children: React.ReactNode;
};

export const Form = ({
  childrenAsBlocks,
  className,
  formStyle = EnumFormStyle.Default,
  formHeaderContent,
  children,
  ...rest
}: Props) => {
  return (
    <FormikForm
      {...rest}
      className={classNames(
        "amp-form",
        className,
        {
          "amp-form--children-as-blocks": childrenAsBlocks,
        },
        `amp-form--${formStyle}`
      )}
    >
      {formHeaderContent}
      <div className="amp-form__content">{children}</div>
    </FormikForm>
  );
};
