import { Button, TextField, ToggleField } from "@amplication/design-system";
import React from "react";
import "./GitReposBar.scss";
const CLASS_NAME = "github-repos-bar";

type Props = {
  loading: boolean;
};

export default function GitReposBar({ loading }: Props) {
  return (
    <div className={CLASS_NAME}>
      <div id={`${CLASS_NAME}-text-input`}>
        <TextField
          name="name"
          autoComplete="off"
          type="text"
          label="Repository name"
        />
      </div>
      <div className={`${CLASS_NAME}__toggle`}>
        <ToggleField name="public" label="Public" />
      </div>
      <Button type="submit" disabled={loading}>
        Create new
      </Button>
    </div>
  );
}
