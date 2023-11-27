import { EnumTextStyle, ListItem, Text } from "@amplication/ui/design-system";

type CatalogProps = {
  name: string;
  changelog: string;
};

export const DSGCatalog: React.FC<CatalogProps> = ({ name, changelog }) => {
  const changelogParagraphs = changelog.split("\n");
  const changelogText = changelogParagraphs.map((paragraph, index) => (
    <p key={index}>{paragraph}</p>
  ));
  return (
    <ListItem>
      <Text textStyle={EnumTextStyle.Normal}>{name}</Text>
      <Text textStyle={EnumTextStyle.Tag}>{changelogText}</Text>
    </ListItem>
  );
};
