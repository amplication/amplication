import {
  Button,
  EnumFlexDirection,
  EnumGapSize,
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
import classNames from "classnames";
import { useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import ResourceCircleBadge from "../../Components/ResourceCircleBadge";
import * as models from "../../models";
import { EnumResourceType, EnumUserActionStatus } from "../../models";
import { generatedKey } from "../../Plugins/InstalledPluginSettings";
import {
  ModelChanges,
  OverrideChanges,
} from "../../Project/ArchitectureConsole/types";
import { formatError } from "../../util/error";
import { useProjectBaseUrl } from "../../util/useProjectBaseUrl";
import "./BreakTheMonolith.scss";
import { BtmLoader } from "./BtmLoader";
import { useBtmService } from "./hooks/useBtmService";

const CLASS_NAME = "break-the-monolith";

const LOADER_TITLE = "Experience the microservices marvel using Amplication AI";
const LOADER_SUBTITLE =
  "Our AI-driven magic is currently at work, suggesting how to elevate your service and its entities into a thriving microservices wonderland";

type Props = {
  resource: models.Resource;
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
  const { baseUrl } = useProjectBaseUrl();
  const { btmResult, loading, error } = useBtmService({
    resourceId: resource?.id,
  });

  const hasError = Boolean(error);
  const errorMessage = formatError(error);

  const redirectToArchitectureAndComplete = useCallback(() => {
    const url = `${baseUrl}/architecture`;

    //convert the result to the model organizer changes format
    const changes = convertBtmChangesToModelOrganizerChanges(btmResult);

    history.push({
      pathname: url,
      state: { changes },
    });
    onComplete && onComplete();
  }, [btmResult, baseUrl, history, onComplete]);

  useEffect(() => {
    if (btmResult && btmResult.status === EnumUserActionStatus.Completed) {
      autoRedirectAfterCompletion && redirectToArchitectureAndComplete();
    }
  }, [
    btmResult,
    autoRedirectAfterCompletion,
    redirectToArchitectureAndComplete,
  ]);

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
              <Text
                textAlign={EnumTextAlign.Center}
                textColor={EnumTextColor.Black20}
              >
                All suggestions can be edited and customized on the next step.
                You can move entities between services, add new services, and
                more.
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
                panelStyle={EnumPanelStyle.Transparent}
                className={`${CLASS_NAME}__confirmation`}
              >
                <FlexItem
                  direction={EnumFlexDirection.Column}
                  itemsAlign={EnumItemsAlign.Start}
                >
                  <Button
                    className={`${CLASS_NAME}__continue_button`}
                    onClick={redirectToArchitectureAndComplete}
                  >
                    Let's go!
                  </Button>
                </FlexItem>
              </Panel>

              <div className={`${CLASS_NAME}__content`}>
                <Panel
                  className={`${CLASS_NAME}__services`}
                  panelStyle={EnumPanelStyle.Transparent}
                >
                  {btmResult?.data?.microservices.map((item, index) => (
                    <List
                      key={index}
                      className={`${CLASS_NAME}__services__service`}
                      listStyle={EnumListStyle.Dark}
                      headerContent={
                        <FlexItem
                          itemsAlign={EnumItemsAlign.Start}
                          className={`${CLASS_NAME}__services__service__header`}
                          start={
                            <ResourceCircleBadge
                              type={EnumResourceType.Service}
                              size={"xsmall"}
                            />
                          }
                        >
                          <FlexItem
                            itemsAlign={EnumItemsAlign.Start}
                            direction={EnumFlexDirection.Column}
                            gap={EnumGapSize.Small}
                          >
                            <Text
                              textStyle={EnumTextStyle.Tag}
                              textColor={EnumTextColor.White}
                              className={`${CLASS_NAME}__services__service__description`}
                            >
                              {item.name}
                            </Text>
                            <Text
                              textStyle={EnumTextStyle.Tag}
                              className={`${CLASS_NAME}__services__service__description`}
                            >
                              {item.functionality}
                            </Text>
                          </FlexItem>
                        </FlexItem>
                      }
                    >
                      <ListItem
                        className={`${CLASS_NAME}__services__service__entities`}
                      >
                        {item.tables.map((entity) => (
                          <Text
                            key={entity.originalEntityId}
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

const convertBtmChangesToModelOrganizerChanges = (
  results: models.BreakServiceToMicroservicesResult
): OverrideChanges => {
  const btmChanges: ModelChanges = {
    movedEntities: [],
    newServices: [],
  };

  results.data.microservices.forEach(async (microservice) => {
    const tempId = generatedKey();
    const newService = {
      id: tempId,
      name: microservice.name,
      description: microservice.functionality,
    };
    btmChanges.newServices.push(newService);

    microservice.tables.forEach((entity) => {
      const movedEntity = {
        entityId: entity.originalEntityId,
        targetResourceId: tempId,
        originalResourceId: results.originalResourceId,
      };
      btmChanges.movedEntities.push(movedEntity);
    });
  });

  return { changes: btmChanges, resourceId: results.originalResourceId };
};
