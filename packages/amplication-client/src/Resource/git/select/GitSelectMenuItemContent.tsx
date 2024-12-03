import {
  EnumFlexDirection,
  EnumItemsAlign,
  FlexItem,
} from "@amplication/ui/design-system";

type Props = {
  logo: string;
  name: string;
};

export const GitSelectMenuItemContent = ({ logo, name }: Props) => {
  return (
    <FlexItem
      direction={EnumFlexDirection.Row}
      itemsAlign={EnumItemsAlign.Center}
      start={logo && <img src={logo} alt="" />}
    >
      {name}
    </FlexItem>
  );
};
