import React, { useCallback } from "react";
import { Link, match } from "react-router-dom";
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

type Props = {
  match: match<{ application: string }>;
};

const NewEntity = ({ match }: Props) => {
  const [createEntity, { error }] = useMutation(CREATE_ENTITY);

  const handleSubmit = useCallback(
    (event) => {
      const formData = new FormData(event);
      createEntity({
        variables: { data: { name: formData.get("name") } },
      }).catch(console.error);
    },
    [createEntity]
  );

  const errorMessage = error?.graphQLErrors?.[0].message;

  return (
    <>
      <DrawerHeader>
        <DrawerTitle>New Entity</DrawerTitle>
      </DrawerHeader>

      <DrawerContent>
        <form onSubmit={handleSubmit}>
          <TextField label="Name" name="name" />
          <Button raised type="submit">
            Create
          </Button>
        </form>
        <Link to={`/${match.params.application}/entities/`}>
          <Button type="button">Cancel</Button>
        </Link>
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
