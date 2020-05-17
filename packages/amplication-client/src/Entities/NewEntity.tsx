import React from "react";
import { Link, match } from "react-router-dom";
import { DrawerHeader, DrawerTitle, DrawerContent } from "@rmwc/drawer";
import "@rmwc/drawer/styles";
import { TextField } from "@rmwc/textfield";
import "@rmwc/textfield/styles";
import { Button } from "@rmwc/button";
import "@rmwc/button/styles";

type Props = {
  match: match<{ application: string }>;
};

const NewEntity = ({ match }: Props) => {
  return (
    <>
      <DrawerHeader dir="ltr">
        <DrawerTitle>New Entity</DrawerTitle>
      </DrawerHeader>

      <DrawerContent dir="ltr">
        <TextField label="Name" />
        <Button raised>Create</Button>
        <Link to={`/${match.params.application}/entities/`}>
          <Button>Cancel</Button>
        </Link>
      </DrawerContent>
    </>
  );
};

export default NewEntity;
