import React from "react";
import { Button } from "@amplication/design-system";
import { Formik } from "formik";
import { Dialog, DialogProps } from "@primer/components";
import { DisplayNameField } from "../Components/DisplayNameField";
import { Form } from "../Components/Form";
import NameField from "../Components/NameField";
import "./RelatedFieldDialog.scss";

export type Values = {
  relatedFieldName: string;
  relatedFieldDisplayName: string;
};

export type Props = DialogProps & {
  onSubmit: (data: Values) => void;
};

const INITIAL_VALUES: Values = {
  relatedFieldName: "",
  relatedFieldDisplayName: "",
};

export const RelatedFieldDialog = ({
  isOpen,
  onDismiss,
  onSubmit,
}: Props): React.ReactElement => {
  return (
    <Dialog
      isOpen={isOpen}
      onDismiss={onDismiss}
      className="RelatedFieldDialog"
    >
      <Formik onSubmit={onSubmit} initialValues={INITIAL_VALUES}>
        {(formik) => (
          <Form>
            <h2>Related Field</h2>
            <DisplayNameField
              name="relatedFieldDisplayName"
              label="Display Name"
              required
            />
            <NameField name="relatedFieldName" required />
            <Button>Submit</Button>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
