import {
  EnumFlexDirection,
  EnumTextStyle,
  FlexItem,
  Text,
} from "@amplication/ui/design-system";
import { EnumGitProvider } from "../../../../models";
import GitRepoDetails from "../../GitRepoDetails";

type Props = {
  gitProvider: EnumGitProvider;
  repositoryFullName: string;
  repositoryUrl: string;
};

function ResourceGitSyncDetailsContent({
  gitProvider,
  repositoryFullName,
  repositoryUrl,
}: Props) {
  return (
    <FlexItem direction={EnumFlexDirection.Column}>
      <Text noWrap>
        <GitRepoDetails
          gitRepositoryFullName={repositoryFullName}
          gitProvider={gitProvider}
        />
      </Text>
      <Text textStyle={EnumTextStyle.Tag} underline={true}>
        <a href={repositoryUrl} target="github_repo">
          {repositoryUrl}
        </a>
      </Text>
    </FlexItem>
  );
}

export default ResourceGitSyncDetailsContent;
