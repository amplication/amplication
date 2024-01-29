import {
  Button,
  EnumFlexDirection,
  EnumItemsAlign,
  EnumListStyle,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Icon,
  List,
  ListItem,
  Text,
} from "@amplication/ui/design-system";
import { useBtmService } from "./hooks/useBtmService";
import { BtmLoader } from "./BtmLoader";
import "./BreakTheMonolith.scss";

const CLASS_NAME = "break-the-monolith";

type Props = {
  resourceId: string;
  handleConfirmSuggestion: () => void;
  openInModal?: boolean;
};

const BreakTheMonolith: React.FC<Props> = ({
  resourceId,
  openInModal = false,
  handleConfirmSuggestion,
}) => {
  const { btmResult, loading, error } = useBtmService({
    resourceId,
  });

  return (
    <div className={CLASS_NAME}>
      {loading ? (
        <div className={`${CLASS_NAME}__loader`}>
          <BtmLoader />
        </div>
      ) : (
        <>
          <div className={`${CLASS_NAME}__content`}>
            <FlexItem
              direction={EnumFlexDirection.Column}
              itemsAlign={
                openInModal ? EnumItemsAlign.Center : EnumItemsAlign.Start
              }
            >
              <Text textStyle={EnumTextStyle.H3}>
                Microservices Suggestion by Amplication AI
              </Text>
              <Text
                textStyle={
                  openInModal ? EnumTextStyle.Normal : EnumTextStyle.Tag
                }
                textColor={EnumTextColor.Black20}
              >
                Our AI has mapped out a sleek microservices architecture for
                you. Check out the suggested breakdown and start streamlining
                your system.
              </Text>
            </FlexItem>
            <div className={`${CLASS_NAME}__services`}>
              {btmResult?.data?.microservices.map((item) => (
                <List
                  className={`${CLASS_NAME}__services__service`}
                  listStyle={EnumListStyle.Dark}
                  headerContent={
                    <FlexItem
                      className={`${CLASS_NAME}__services__service__header`}
                      start={<Icon icon="settings"></Icon>}
                    >
                      {item.name}
                    </FlexItem>
                  }
                >
                  <ListItem
                    className={`${CLASS_NAME}__services__service__entities`}
                  >
                    {item.dataModels.map((entity) => (
                      <Text
                        className={`${CLASS_NAME}__services__service__entities__entity`}
                        textStyle={EnumTextStyle.Subtle}
                      >
                        {entity.name}
                      </Text>
                    ))}
                  </ListItem>
                </List>
              ))}
            </div>
            <Button
              className={`${CLASS_NAME}__continue_button`}
              onClick={handleConfirmSuggestion}
            >
              Let's go!
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default BreakTheMonolith;
