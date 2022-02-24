import { Button, EnumButtonStyle } from "@amplication/design-system";
import React from "react";

type Props = {
  handleAuthWithGithubClick: (data: any) => any;
};

export default function NewConnection({ handleAuthWithGithubClick }: Props) {
  return (
    <Button
      buttonStyle={EnumButtonStyle.Primary}
      onClick={handleAuthWithGithubClick}
      icon="github"
    >
      Sync with GitHub
    </Button>
  );
}
