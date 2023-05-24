import { Snackbar, TextField } from "@amplication/ui/design-system";
import { gql, Reference, useMutation } from "@apollo/client";
import { Form, Formik } from "formik";
import { pascalCase } from "pascal-case";
import { useCallback, useContext, useEffect } from "react";
import { GlobalHotKeys } from "react-hotkeys";
import { useHistory } from "react-router-dom";
import { Button, EnumButtonStyle } from "../Components/Button";
import {
  generatePluralDisplayName,
  generateSingularDisplayName,
} from "../Components/PluralDisplayNameField";
import { EnumImages, SvgThemeImage } from "../Components/SvgThemeImage";
import { AppContext } from "../context/appContext";
import * as models from "../models";
import { formatError } from "../util/error";
import { validate } from "../util/formikValidateJsonSchema";
import { CROSS_OS_CTRL_ENTER } from "../util/hotkeys";
import "./NewEntity.scss";

type CreateEntityType = Omit<models.EntityCreateInput, "resource">;

type DType = {
  createOneEntity: models.Entity;
};

type Props = {
  resourceId: string;
  onSuccess: () => void;
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

const NewEntity = ({ resourceId, onSuccess }: Props) => {
  const history = useHistory();
  const { addEntity, currentWorkspace, currentProject } =
    useContext(AppContext);

  const [createEntity, { error, data, loading }] = useMutation<DType>(
    CREATE_ENTITY,
    {
      onCompleted: (data) => {
        addEntity(data.createOneEntity.id);

        onSuccess();
        history.push(`entities/${data.createOneEntity.id}`);
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
