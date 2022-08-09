import React, { useCallback, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Formik, Form } from "formik";
import { gql, useMutation, Reference } from "@apollo/client";
import { GlobalHotKeys } from "react-hotkeys";
import { pascalCase } from "pascal-case";
import { formatError } from "../util/error";
import * as models from "../models";
import { TextField, Snackbar } from "@amplication/design-system";
import { Button, EnumButtonStyle } from "../Components/Button";
import {
  generatePluralDisplayName,
  generateSingularDisplayName,
} from "../Components/PluralDisplayNameField";
import { useTracking } from "../util/analytics";
import { validate } from "../util/formikValidateJsonSchema";
import { CROSS_OS_CTRL_ENTER } from "../util/hotkeys";
import { SvgThemeImage, EnumImages } from "../Components/SvgThemeImage";
import "./NewEntity.scss";
import { AppContext } from "../context/appContext";

type CreateEntityType = Omit<models.EntityCreateInput, "resource">;

type DType = {
  createOneEntity: models.Entity;
};

type Props = {
  resourceId: string;
};

const INITIAL_VALUES: CreateEntityType = {
  name: "",
  displayName: "",
  pluralDisplayName: "",
  description: "",
};

const FORM_SCHEMA = {
  required: ["displayName"],
  properties: {
    displayName: {
      type: "string",
      minLength: 2,
    },
  },
};
const CLASS_NAME = "new-entity";

const keyMap = {
  SUBMIT: CROSS_OS_CTRL_ENTER,
};

const NewEntity = ({ resourceId }: Props) => {
  const { trackEvent } = useTracking();
  const { addEntity, currentWorkspace, currentProject } = useContext(AppContext);

  const [createEntity, { error, data, loading }] = useMutation<DType>(
    CREATE_ENTITY,
    {
      onCompleted: (data) => {
        addEntity(data.createOneEntity.id);
        trackEvent({
          eventName: "createEntity",
          entityName: data.createOneEntity.displayName,
        });
      },
      update(cache, { data }) {
        if (!data) return;

        const newEntity = data.createOneEntity;

        cache.modify({
          fields: {
            entities(existingEntityRefs = [], { readField }) {
              const newEntityRef = cache.writeFragment({
                data: newEntity,
                fragment: NEW_ENTITY_FRAGMENT,
              });

              if (
                existingEntityRefs.some(
                  (EntityRef: Reference) =>
                    readField("id", EntityRef) === newEntity.id
                )
              ) {
                return existingEntityRefs;
              }

              return [...existingEntityRefs, newEntityRef];
            },
          },
        });
      },
    }
  );
  const history = useHistory();

  const handleSubmit = useCallback(
    (data: CreateEntityType) => {
      const displayName = data.displayName.trim();
      const pluralDisplayName = generatePluralDisplayName(displayName);
      const singularDisplayName = generateSingularDisplayName(displayName);
      const name = pascalCase(singularDisplayName);

      createEntity({
        variables: {
          data: {
            ...data,
            displayName,
            name,
            pluralDisplayName,
            resource: { connect: { id: resourceId } },
          },
        },
      }).catch(console.error);
    },
    [createEntity, resourceId]
  );

  useEffect(() => {
    if (data) {
      history.push(
        `/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/entities/${data.createOneEntity.id}`
      );
    }
  }, [history, data, resourceId, currentWorkspace, currentProject]);

  const errorMessage = formatError(error);

  return (
    <div className={CLASS_NAME}>
      <SvgThemeImage image={EnumImages.Entities} />
      <div className={`${CLASS_NAME}__instructions`}>
        Give your new entity a descriptive name. <br />
        For example: Customer, Support Ticket, Purchase Order...
      </div>
      <Formik
        initialValues={INITIAL_VALUES}
        validate={(values: CreateEntityType) => validate(values, FORM_SCHEMA)}
        onSubmit={handleSubmit}
        validateOnMount
      >
        {(formik) => {
          const handlers = {
            SUBMIT: formik.submitForm,
          };
          return (
            <Form>
              <GlobalHotKeys keyMap={keyMap} handlers={handlers} />
              <TextField
                name="displayName"
                label="New Entity Name"
                disabled={loading}
                autoFocus
                hideLabel
                placeholder="Type New Entity Name"
                autoComplete="off"
              />
              <Button
                type="submit"
                buttonStyle={EnumButtonStyle.Primary}
                disabled={!formik.isValid || loading}
              >
                Create Entity
              </Button>
            </Form>
          );
        }}
      </Formik>
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </div>
  );
};

export default NewEntity;

const CREATE_ENTITY = gql`
  mutation createEntity($data: EntityCreateInput!) {
    createOneEntity(data: $data) {
      id
      name
      fields {
        id
        name
        dataType
      }
    }
  }
`;

const NEW_ENTITY_FRAGMENT = gql`
  fragment NewEntity on Entity {
    id
    name
    fields {
      id
      name
      dataType
    }
  }
`;
