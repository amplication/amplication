import React, { useCallback, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { DrawerHeader, DrawerTitle, DrawerContent } from "@rmwc/drawer";
import "@rmwc/drawer/styles";
import { TextField } from "@rmwc/textfield";
import "@rmwc/textfield/styles";
import { Button } from "@rmwc/button";
import "@rmwc/button/styles";
import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";
import { Switch } from "@rmwc/switch";
import "@rmwc/switch/styles";
import { formatError } from "../errorUtil";
import getFormData from "../get-form-data";

type Props = {
  application: string;
  onCreate: () => void;
};

const NewEntity = ({ application, onCreate }: Props) => {
  const [createEntity, { error, data }] = useMutation(CREATE_ENTITY);
  const history = useHistory();

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      const data = getFormData(event.target);
      createEntity({
        variables: {
          data: {
            ...data,
            app: { connect: { id: application } },
          },
        },
      })
        .then(onCreate)
        .catch(console.error);
    },
    [createEntity, onCreate, application]
  );

  useEffect(() => {
    if (data) {
      history.push(`/${application}/entities/`);
    }
  }, [history, data, application]);

  const errorMessage = formatError(error);

  return (
    <>
      <DrawerHeader>
        <DrawerTitle>New Entity</DrawerTitle>
      </DrawerHeader>

      <DrawerContent>
        <form onSubmit={handleSubmit}>
          <p>
            <TextField label="Name" name="name" minLength={1} />
          </p>
          <p>
            <TextField label="Display Name" name="displayName" minLength={1} />
          </p>
          <p>
            <TextField
              label="Plural Display Name"
              name="pluralDisplayName"
              minLength={1}
            />
          </p>
          <p>
            Persistent <Switch name="isPersistent" checked={false} />
          </p>
          <p>
            Allow Feedback <Switch name="allowFeedback" checked={false} />
          </p>
          <Button raised type="submit">
            Create
          </Button>
          <Link to={`/${application}/entities/`}>
            <Button type="button">Cancel</Button>
          </Link>
        </form>
      </DrawerContent>
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </>
  );
};

export default NewEntity;

const CREATE_ENTITY = gql`
  mutation createEntity($data: EntityCreateInput!) {
    createOneEntity(data: $data) {
      id
    }
  }
`;
