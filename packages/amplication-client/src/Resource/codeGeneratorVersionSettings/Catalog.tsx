import { EnumTextStyle, ListItem, Text } from "@amplication/ui/design-system";

type CatalogProps = {
  name: string;
  changelog: string;
};

export const DSGCatalog: React.FC<CatalogProps> = ({ name, changelog }) => {
  return (
    <ListItem>
      <Text textStyle={EnumTextStyle.Normal}>{name}</Text>
      <Text textStyle={EnumTextStyle.Tag}>{changelog}</Text>
    </ListItem>
  );
};
