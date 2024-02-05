import {
  Button,
  EnumFlexDirection,
  EnumItemsAlign,
  EnumListStyle,
  EnumPanelStyle,
  EnumTextAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  List,
  ListItem,
  Panel,
  Text,
} from "@amplication/ui/design-system";
import ResourceCircleBadge from "../../Components/ResourceCircleBadge";
import { EnumResourceType } from "../../models";
import "./BreakTheMonolith.scss";
import { BtmLoader } from "./BtmLoader";
import { useBtmService } from "./hooks/useBtmService";
import classNames from "classnames";
import { formatError } from "../../util/error";
import { Resource } from "../../models";

const CLASS_NAME = "break-the-monolith";

type Props = {
  resource: Resource;
  handleConfirmSuggestion: () => void;
  openInFullScreen?: boolean;
};

const BreakTheMonolith: React.FC<Props> = ({
  resource,
  openInFullScreen = false,
  handleConfirmSuggestion,
}) => {
  const { btmResult, loading, error } = useBtmService({
    resourceId: resource?.id,
  });

  const hasError = Boolean(error);
  const errorMessage = formatError(error);

  return (
    <div
      className={classNames(CLASS_NAME, {
        [`${CLASS_NAME}--full-screen`]: openInFullScreen,
      })}
    >
      {loading ? (
        <div className={`${CLASS_NAME}__loader`}>
          <BtmLoader />
        </div>
      ) : (
        <>
          <div className={`${CLASS_NAME}__header`}>
            <FlexItem
              direction={EnumFlexDirection.Column}
              itemsAlign={EnumItemsAlign.Center}
            >
              <Text
                textStyle={EnumTextStyle.H3}
                textAlign={EnumTextAlign.Center}
              >
                Microservices Suggestion by Amplication AI
              </Text>
              <Text
                textStyle={
                  openInFullScreen ? EnumTextStyle.Normal : EnumTextStyle.Tag
                }
                textAlign={EnumTextAlign.Center}
                textColor={EnumTextColor.Black20}
              >
                Our AI has mapped out a sleek microservices architecture for
                you. Check out the suggested breakdown and start streamlining
                your system.
              </Text>
            </FlexItem>
          </div>
          {hasError ? (
            <Panel
              panelStyle={EnumPanelStyle.Bordered}
              className={`${CLASS_NAME}__error`}
            >
              <Text
                textStyle={EnumTextStyle.Tag}
                textColor={EnumTextColor.ThemeRed}
              >
                {errorMessage}
              </Text>
            </Panel>
          ) : (
            <>
              <Panel
                panelStyle={EnumPanelStyle.Default}
                className={`${CLASS_NAME}__confirmation`}
              >
                <Text
                  textStyle={EnumTextStyle.Tag}
                  textColor={EnumTextColor.White}
                >
                  All suggestions can be edited and customized on the next step.
                  You can move entities between services, add new services, and
                  more.
                </Text>
                <Button
                  className={`${CLASS_NAME}__continue_button`}
                  onClick={handleConfirmSuggestion}
                >
                  Let's go!
                </Button>
              </Panel>
              <div className={`${CLASS_NAME}__content`}>
                <Panel className={`${CLASS_NAME}__services`}>
                  {btmResult?.data?.microservices.map((item) => (
                    <List
                      className={`${CLASS_NAME}__services__service`}
                      listStyle={EnumListStyle.Dark}
                      headerContent={
                        <FlexItem
                          itemsAlign={EnumItemsAlign.Center}
                          className={`${CLASS_NAME}__services__service__header`}
                          start={
                            <ResourceCircleBadge
                              type={EnumResourceType.Service}
                              size={"xsmall"}
                            />
                          }
                        >
                          <Text
                            textStyle={EnumTextStyle.Tag}
                            textColor={EnumTextColor.White}
                          >
                            {item.name}
                          </Text>
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
                </Panel>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default BreakTheMonolith;
