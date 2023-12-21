import React, { useCallback } from "react";
import { gql, useQuery } from "@apollo/client";
import {
  Button,
  Dialog,
  DialogProps,
  EnumButtonStyle,
} from "@amplication/ui/design-system";
import { camelCase } from "camel-case";
import { Formik, useFormikContext } from "formik";
import { DisplayNameField } from "../Components/DisplayNameField";
import { Form } from "../Components/Form";
import NameField from "../Components/NameField";
import * as models from "../models";
import "./RelatedFieldDialog.scss";

export type Values = {
  relatedFieldName: string;
  relatedFieldDisplayName: string;
};

export type Props = Omit<DialogProps, "title"> & {
  onSubmit: (data: Values) => void;
  relatedEntityId: string | undefined;
  allowMultipleSelection: boolean;
  entity: models.Entity;
};

const EMPTY_VALUES: Values = {
  relatedFieldName: "",
  relatedFieldDisplayName: "",
};

const CLASS_NAME = "related-field-dialog";

export const RelatedFieldDialog = ({
  isOpen,
  onDismiss,
  onSubmit,
  entity,
  relatedEntityId,
  allowMultipleSelection,
}: Props): React.ReactElement => {
  const { data, loading } = useQuery<{ entity: models.Entity }>(
    GET_RELATED_ENTITY_FIELDS,
    {
      variables: {
        entityId: relatedEntityId,
      },
      skip: !relatedEntityId,
    }
  );

  const valuesSuggestion = allowMultipleSelection
    ? {
        relatedFieldName: camelCase(entity.pluralDisplayName),
        relatedFieldDisplayName: entity.pluralDisplayName,
      }
    : {
        relatedFieldName: camelCase(entity.name),
        relatedFieldDisplayName: entity.displayName,
      };
  const initialValues: Values =
    data &&
    data.entity.fields &&
    data.entity.fields.every(
      (field) =>
        field.name !== valuesSuggestion.relatedFieldName &&
        field.displayName !== valuesSuggestion.relatedFieldDisplayName
    )
      ? valuesSuggestion
      : EMPTY_VALUES;

  return (
    <Dialog
      isOpen={isOpen}
      onDismiss={onDismiss}
      title={`Name the relation field on ${data?.entity?.name}`}
    >
      <div className={CLASS_NAME}>
        <div className={`${CLASS_NAME}__instructions`}>
          To create the relation to <b>{data?.entity?.name}</b>, we also need to
          create an opposite related field on <b>{data?.entity?.name}</b> back
          to <b>{entity.name}</b>.
        </div>
        <div className={`${CLASS_NAME}__instructions`}>
          Please select a name for the new field on <b>{data?.entity?.name}</b>
        </div>
        <Formik
          onSubmit={onSubmit}
          initialValues={initialValues}
          enableReinitialize
        >
          <Form>
            {loading && "Loading..."}

            <RelatedFieldDisplayNameField disabled={loading} />
            <NameField name="relatedFieldName" required disabled={loading} />
            <div className={`${CLASS_NAME}__buttons`}>
              <Button
                type="button"
                buttonStyle={EnumButtonStyle.Text}
                onClick={onDismiss}
              >
                Dismiss
              </Button>
              <Button type="submit">Create</Button>
            </div>
          </Form>
        </Formik>
      </div>
    </Dialog>
  );
};

const RelatedFieldDisplayNameField = ({
  disabled,
}: {
  disabled: boolean;
}): React.ReactElement => {
  const formik = useFormikContext<Values>();

  const handleLabelChange = useCallback(
    (event) => {
      const newValue = camelCase(event.target.value);
      formik.values.relatedFieldName = newValue;
    },
    [formik.values]
  );

  return (
    <DisplayNameField
      name="relatedFieldDisplayName"
      label="Display Name"
      required
      disabled={disabled}
      onChange={handleLabelChange}
    />
  );
};

const GET_RELATED_ENTITY_FIELDS = gql`
  query getRelatedEntity($entityId: String!) {
    entity(where: { id: $entityId }) {
      name
      displayName
      fields {
        id
        name
      }
    }
  }
`;
