import {
  EnumFlexDirection,
  EnumItemsAlign,
  FlexItem,
} from "@amplication/ui/design-system";
import { EnumGitProvider } from "../../../models";
import GitProviderLogo from "../GitProviderLogo";

type Props = {
  gitProvider: EnumGitProvider;
  name: string;
};
const CLASS_NAME = "git-select-group-item";

export const GitSelectGroupItem = ({ gitProvider, name }: Props) => {
  return (
    <FlexItem
      className={CLASS_NAME}
      direction={EnumFlexDirection.Row}
      itemsAlign={EnumItemsAlign.Center}
      start={<GitProviderLogo gitProvider={gitProvider} />}
    >
      {name}
    </FlexItem>
  );
};
