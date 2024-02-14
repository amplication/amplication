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
import { useHistory } from "react-router-dom";
import { useCallback, useEffect } from "react";
import { useAppContext } from "../../context/appContext";

const CLASS_NAME = "break-the-monolith";

const LOADER_TITLE = "Experience the Microservices Marvel using Amplication AI";
const LOADER_SUBTITLE =
  "Our AI-driven magic is currently at work, suggesting how to elevate your service and its entities into a thriving microservices wonderland";

type Props = {
  resource: Resource;
  onComplete: () => void;
  openInFullScreen?: boolean;
  autoRedirectAfterCompletion?: boolean;
};

const BreakTheMonolith: React.FC<Props> = ({
  resource,
  openInFullScreen = false,
  autoRedirectAfterCompletion = false,
  onComplete,
}) => {
  const history = useHistory();
  const { currentWorkspace, currentProject } = useAppContext();
  const { btmResult, loading, error } = useBtmService({
    resourceId: resource?.id,
  });

  const hasError = Boolean(error);
  const errorMessage = formatError(error);

  useEffect(() => {
    if (btmResult) {
      // TODO: prepare data for architecture page before redirect
      autoRedirectAfterCompletion &&
        history.push(
          `/${currentWorkspace?.id}/${currentProject?.id}/architecture`
        );
    }
  }, [
    btmResult,
    autoRedirectAfterCompletion,
    history,
    currentWorkspace,
    currentProject,
  ]);

  const handleConfirmSuggestion = useCallback(() => {
    // TODO: prepare data for architecture page before redirect
    openInFullScreen &&
      history.push(
        `/${currentWorkspace?.id}/${currentProject?.id}/architecture`
      );
    onComplete();
  }, [currentProject, currentWorkspace, history, onComplete, openInFullScreen]);

  return (
    <div
      className={classNames(CLASS_NAME, {
        [`${CLASS_NAME}--full-screen`]: openInFullScreen,
      })}
    >
      {loading ? (
        <div className={`${CLASS_NAME}__loader`}>
          <BtmLoader title={LOADER_TITLE} subtitle={LOADER_SUBTITLE} />
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
                        {item.tables.map((entity) => (
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
