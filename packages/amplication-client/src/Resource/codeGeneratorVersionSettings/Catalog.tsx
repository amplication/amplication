import React from "react";
import ReactMarkdown from "react-markdown";
import { EnumTextStyle, ListItem, Text } from "@amplication/ui/design-system";

type CatalogProps = {
  name: string;
  changelog: string;
};

export const DSGCatalog: React.FC<CatalogProps> = ({ name, changelog }) => {
  return (
    <ListItem>
      <Text textStyle={EnumTextStyle.Normal}>{name}</Text>
      <ReactMarkdown className="amp-text--tag">{changelog}</ReactMarkdown>
    </ListItem>
  );
};
