import {
  EnumFlexDirection,
  EnumItemsAlign,
  FlexItem,
} from "@amplication/ui/design-system";

type Props = {
  logo: string;
  name: string;
};
const CLASS_NAME = "git-select-group-item";

export const GitSelectGroupItem = ({ logo, name }: Props) => {
  return (
    <FlexItem
      className={CLASS_NAME}
      direction={EnumFlexDirection.Row}
      itemsAlign={EnumItemsAlign.Center}
      start={
        logo && <img className={`${CLASS_NAME}__logo`} src={logo} alt="" />
      }
    >
      {name}
    </FlexItem>
  );
};
