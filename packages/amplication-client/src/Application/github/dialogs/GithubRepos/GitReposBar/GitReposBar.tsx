import { Button, TextField, ToggleField } from "@amplication/design-system";
import React from "react";

const CLASS_NAME = "github-repos-bar";

type Props = {
  loading: boolean;
};

export default function GitReposBar({ loading }: Props) {
  return (
    <div className={CLASS_NAME}>
      <TextField
        name="name"
        autoComplete="off"
        type="text"
        label="Repository name"
      />
      <ToggleField name="public" label="Public" />
      <Button type="submit" disabled={loading}>
        Create new
      </Button>
    </div>
  );
}
