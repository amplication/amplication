import {
  EnumContentAlign,
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumGapSize,
  EnumItemsAlign,
  EnumListStyle,
  EnumPanelStyle,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  List,
  ListItem,
  Panel,
  Text,
} from "@amplication/ui/design-system";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, EnumButtonStyle } from "../../Components/Button";
import { ApplyChangesNextSteps } from "./ApplyChangesNextSteps";
import CreateApplyChangesLoader from "./CreateApplyChangesLoader";
import "./ModelOrganizerConfirmation.scss";
import { EntityNode, ModelChanges, NODE_TYPE_MODEL, Node } from "./types";
import ActionLog from "../../VersionControl/ActionLog";
import * as models from "../../models";

type movedEntitiesData = {
  id: string;
  name: string;
};
export const CLASS_NAME = "model-organizer-confirmation";
const MIN_TIME_OUT_LOADER = 2000;

type Props = {
  onConfirmChanges: () => void;
  onCancelChanges: () => void;
  changes: ModelChanges;
  nodes: Node[];
  applyChangesLoading: boolean;
  applyChangesErrorMessage: string;
  applyChangesData: models.UserAction;
};

export default function ModelOrganizerConfirmation({
  onConfirmChanges,
  onCancelChanges,
  nodes,
  changes,
  applyChangesLoading,
  applyChangesErrorMessage,
  applyChangesData,
}: Props) {
  const [applyChangesSteps, setApplyChangesSteps] = useState<boolean>(false);
  const [keepLoadingChanges, setKeepLoadingChanges] = useState<boolean>(false);

  const movedEntities = useMemo(() => {
    const movedEntities: movedEntitiesData[] = [];
    nodes
      .filter((n) => n.type === NODE_TYPE_MODEL)
      .forEach((n: EntityNode) => {
        if (n.data.originalParentNode !== n.parentNode) {
          movedEntities.push({
            id: n.data.payload.id,
            name: n.data.payload.displayName,
          });
        }
      });
    return movedEntities;
  }, [nodes]);

  useEffect(() => {
    if (applyChangesLoading) {
      setKeepLoadingChanges(true);
    }
  }, [setKeepLoadingChanges, applyChangesLoading]);

  const handleTimeout = useCallback(() => {
    setKeepLoadingChanges(false);
    setApplyChangesSteps(true);
  }, [setKeepLoadingChanges, setApplyChangesSteps]);

  const ActionStep = applyChangesData?.action?.steps?.length
    ? applyChangesData?.action?.steps[0]
    : null;

  return (
    <div className={CLASS_NAME}>
      {ActionStep?.status === models.EnumActionStepStatus.Failed ? (
        <>
          <Panel
            panelStyle={EnumPanelStyle.Bordered}
            className={`${CLASS_NAME}__error`}
          >
            <Text textStyle={EnumTextStyle.Tag} textColor={EnumTextColor.White}>
              Something went wrong. See the log below for more details.
            </Text>
          </Panel>
          <ActionLog
            height={"250px"}
            action={applyChangesData?.action}
            title={"Apply Changes to Architecture"}
            versionNumber={""}
          />
        </>
      ) : keepLoadingChanges ||
        applyChangesLoading ||
        ActionStep?.status === models.EnumActionStepStatus.Running ? (
        <CreateApplyChangesLoader
          onTimeout={handleTimeout}
          minimumLoadTimeMS={MIN_TIME_OUT_LOADER}
        />
      ) : applyChangesErrorMessage ? (
        <>
          <FlexItem
            direction={EnumFlexDirection.Column}
            itemsAlign={EnumItemsAlign.Start}
            gap={EnumGapSize.Large}
          >
            <Text textStyle={EnumTextStyle.Tag} textColor={EnumTextColor.White}>
              There was an error applying the changes.
            </Text>
            <Panel
              panelStyle={EnumPanelStyle.Bordered}
              className={`${CLASS_NAME}__error`}
            >
              <Text
                textStyle={EnumTextStyle.Tag}
                textColor={EnumTextColor.White}
              >
                {applyChangesErrorMessage}
              </Text>
            </Panel>
          </FlexItem>
          <FlexItem
            margin={EnumFlexItemMargin.Both}
            contentAlign={EnumContentAlign.End}
          >
            <Button
              buttonStyle={EnumButtonStyle.Outline}
              onClick={onCancelChanges}
            >
              Close
            </Button>
          </FlexItem>
        </>
      ) : applyChangesSteps ? (
        <ApplyChangesNextSteps onDisplayArchitectureClicked={onCancelChanges} />
      ) : !applyChangesSteps ? (
        <>
          {changes?.newServices?.length > 0 && (
            <div>
              <Panel panelStyle={EnumPanelStyle.Transparent}>
                <Text
                  textStyle={EnumTextStyle.Tag}
                  textColor={EnumTextColor.White}
                >
                  We're ready to create the following services using default
                  configurations for a smooth start.
                </Text>
                <br />
                <Text textStyle={EnumTextStyle.Tag}>
                  Remember, you can easily tailor the settings for each service
                  to your preference at any point.
                </Text>
              </Panel>

              <>
                <List listStyle={EnumListStyle.Dark}>
                  <ListItem>
                    {changes.newServices.map((service) => (
                      <Text
                        key={service.id}
                        textStyle={EnumTextStyle.Tag}
                        textColor={EnumTextColor.White}
                      >
                        {service.name}
                      </Text>
                    ))}
                  </ListItem>
                </List>
              </>
            </div>
          )}
          <div>
            <Panel panelStyle={EnumPanelStyle.Transparent}>
              <Text
                textStyle={EnumTextStyle.Tag}
                textColor={EnumTextColor.White}
              >
                The following entities will be moved to new services.
              </Text>
              <br />
              <a
                href={
                  "https://docs.amplication.com/how-to/understanding-break-the-monolith"
                }
                target="blank"
              >
                <Text textStyle={EnumTextStyle.Tag} underline>
                  Check our documentation
                </Text>
              </a>

              <Text textStyle={EnumTextStyle.Tag}>
                {" "}
                to understand how relations between entities are resolved as
                part of this migration process. <br /> In case of existing
                database, data migration may be required.
              </Text>
            </Panel>
            <List listStyle={EnumListStyle.Dark}>
              <ListItem>
                {movedEntities.length === 0 && (
                  <Text textStyle={EnumTextStyle.Tag}>
                    No entities will be moved
                  </Text>
                )}
                {movedEntities.map((entity) => (
                  <Text
                    key={entity.id}
                    textStyle={EnumTextStyle.Tag}
                    textColor={EnumTextColor.White}
                  >
                    {entity.name}
                  </Text>
                ))}
              </ListItem>
            </List>
          </div>
          <FlexItem
            itemsAlign={EnumItemsAlign.Center}
            contentAlign={EnumContentAlign.End}
          >
            <Button
              buttonStyle={EnumButtonStyle.Outline}
              onClick={onCancelChanges}
            >
              Cancel
            </Button>
            <Button onClick={onConfirmChanges}>Let's go</Button>
          </FlexItem>
        </>
      ) : null}
    </div>
  );
}
