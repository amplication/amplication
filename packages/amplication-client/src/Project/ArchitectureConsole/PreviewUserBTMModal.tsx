import {
  Text,
  EnumFlexDirection,
  EnumGapSize,
  EnumItemsAlign,
  EnumListStyle,
  EnumTextStyle,
  FlexItem,
  List,
  ListItem,
  EnumTextColor,
} from "@amplication/ui/design-system";
import { ModelChanges } from "./types";
import { CLASS_NAME } from "./ModelOrganizer";
import "./ModelOrganizer.scss";

type Props = {
  changes: ModelChanges;
};

const PreviewUserBTMModal = ({ changes }: Props) => {
  return (
    <>
      <FlexItem
        direction={EnumFlexDirection.Column}
        itemsAlign={EnumItemsAlign.Start}
        gap={EnumGapSize.XLarge}
      >
        <Text textStyle={EnumTextStyle.H2}>
          {"Congratulations on Breaking the Monolith! 🌟"}
        </Text>
        <FlexItem direction={EnumFlexDirection.Column} gap={EnumGapSize.Small}>
          <Text textColor={EnumTextColor.Black20}>
            {`With the open-source monolith successfully broken, we've
      crafted ${changes.newServices?.length} microservices for the project.`}
          </Text>
          <Text textColor={EnumTextColor.Black20}>
            Now you can explore, refine and optimize the suggested architecture
            by-
          </Text>
        </FlexItem>

        <List
          className={`${CLASS_NAME}__preview-user-dialog`}
          listStyle={EnumListStyle.Dark}
        >
          <ListItem>
            <Text textColor={EnumTextColor.Black20}>Rearrange entities</Text>
            <Text textColor={EnumTextColor.Black20}>Create new services</Text>
            <Text textColor={EnumTextColor.Black20}>
              Optimize entity relations
            </Text>
          </ListItem>
        </List>
        <FlexItem direction={EnumFlexDirection.Column} gap={EnumGapSize.Small}>
          <Text textColor={EnumTextColor.Black20}>
            Once satisfied, apply the changes and generate the code for the new
            architecture in one click.
          </Text>
          <Text textColor={EnumTextColor.Black20}>
            Your project's future starts now!
          </Text>
        </FlexItem>
      </FlexItem>
    </>
  );
};

export default PreviewUserBTMModal;
