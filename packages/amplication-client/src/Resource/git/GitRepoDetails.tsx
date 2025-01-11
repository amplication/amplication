import { EnumGitProvider } from "@amplication/code-gen-types";
import {
  EnumFlexDirection,
  EnumItemsAlign,
  FlexItem,
} from "@amplication/ui/design-system";
import React from "react";
import GitProviderLogo from "./GitProviderLogo";

type Props = {
  className?: string;
  gitRepositoryFullName: string;
  gitProvider?: EnumGitProvider;
};

const GitRepoDetails: React.FC<Props> = ({
  className,
  gitRepositoryFullName,
  gitProvider,
}) => {
  return (
    <FlexItem
      className={className}
      direction={EnumFlexDirection.Row}
      itemsAlign={EnumItemsAlign.Center}
    >
      {gitProvider && <GitProviderLogo gitProvider={gitProvider} />}
      {gitRepositoryFullName}
    </FlexItem>
  );
};

export default GitRepoDetails;
