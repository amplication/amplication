import React, { useCallback, useEffect } from "react";
import { Link, match, useHistory, useRouteMatch } from "react-router-dom";
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
      const formData = new FormData(event.target);
      createEntity({
        variables: {
          data: {
            name: formData.get("name"),
            displayName: formData.get("display-name"),
            pluralDisplayName: formData.get("plural-display-name"),
            isPersistent: formData.get("is-persistent") == "on",
            allowFeedback: formData.get("allow-feedback") == "on",
            app: {
              connect: {
                id: application,
              },
            },
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
  }, [history, data]);

  const errorMessage = error?.graphQLErrors?.[0]?.message;

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
            <TextField label="Display Name" name="display-name" minLength={1} />
          </p>
          <p>
            <TextField
              label="Plural Display Name"
              name="plural-display-name"
              minLength={1}
            />
          </p>
          <p>
            Persistent <Switch name="is-persistent" />
          </p>
          <p>
            Allow Feedback <Switch name="allow-feedback" />
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
