import React, { useEffect } from "react";
import { match, useHistory } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { CircularProgress } from "@mui/material";
import {
  Button,
  EnumContentAlign,
  EnumFlexDirection,
  EnumItemsAlign,
  EnumTextAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Panel,
  Text,
} from "@amplication/ui/design-system";
import * as models from "../../../models";
import { MonolithOption, monolithOptions } from "./monolith-options";
import useUserActionWatchStatus from "../../../Entity/ImportPrismaSchema/useUserActionWatchStatus";
import { AppRouteProps } from "../../../routes/routesUtil";
import { CREATE_ENTITIES_FROM_PREDEFINED_SCHEMA } from "../../../Entity/ImportPrismaSchema/queries";

import "./BreakingTheMonolithOptions.scss";

const CLASS_NAME = "breaking-the-monolith-options";

type TData = {
  createEntitiesFromPredefinedSchema: models.UserAction;
};

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
    resource: string;
  }>;
};

const BreakingTheMonolithOptions: React.FC<Props> = ({ match }) => {
  const {
    workspace: workspaceId,
    project: projectId,
    resource: resourceId,
  } = match.params;

  const history = useHistory();
  const [userAction, setUserAction] = React.useState<models.UserAction>(null);
  const { data: userActionData } = useUserActionWatchStatus(userAction);

  const [createEntitiesFormPredefinedSchema] = useMutation<TData>(
    CREATE_ENTITIES_FROM_PREDEFINED_SCHEMA,
    {
      onCompleted: (data) => {
        setUserAction(data.createEntitiesFromPredefinedSchema);
      },
    }
  );

  useEffect(() => {
    if (!userActionData || !userActionData.userAction) return;
    if (
      userActionData.userAction.status === models.EnumUserActionStatus.Completed
    ) {
      history.push(`/${workspaceId}/${projectId}/${resourceId}/entities`); // TODO: change to the architecture page
    }
  }, [userActionData, history, workspaceId, projectId, resourceId]);

  const handleBreakClicked = (selectedMonolithToBreak: MonolithOption) => {
    createEntitiesFormPredefinedSchema({
      variables: {
        data: {
          schemaName: selectedMonolithToBreak.name,
          resource: {
            connect: {
              id: resourceId,
            },
          },
        },
      },
    }).catch(console.error);
  };

  return (
    <>
      {userActionData?.userAction &&
        userActionData?.userAction?.status !==
          models.EnumUserActionStatus.Completed && (
          <div className={`${CLASS_NAME}__overlay`}>
            <CircularProgress />
          </div>
        )}
      <FlexItem
        className={CLASS_NAME}
        direction={EnumFlexDirection.Column}
        itemsAlign={EnumItemsAlign.Center}
      >
        <Text textStyle={EnumTextStyle.H2}>
          Select the monolith you want to break
        </Text>
        <Text
          textStyle={EnumTextStyle.Normal}
          textColor={EnumTextColor.Black20}
          textAlign={EnumTextAlign.Center}
        >
          <div>
            To illustrate how Amplication can transform legacy systems into a
            micro-services architecture,
          </div>
          <div>
            choose an open-source monolith, represented by its database schema
          </div>
        </Text>
        <FlexItem
          className={`${CLASS_NAME}__monolith_options`}
          contentAlign={EnumContentAlign.Center}
        >
          {monolithOptions.map((option, index) => (
            <Panel key={index}>
              <FlexItem direction={EnumFlexDirection.Column}>
                <FlexItem>
                  <Text textStyle={EnumTextStyle.H3}>{option.displayName}</Text>
                  <Button
                    onClick={() => handleBreakClicked(option)}
                    className={`${CLASS_NAME}__action-button`}
                  >
                    Break
                  </Button>
                </FlexItem>
                <Text
                  textStyle={EnumTextStyle.Description}
                  textColor={EnumTextColor.Black20}
                >
                  {option.description}
                </Text>
                <Text textStyle={EnumTextStyle.Label}>
                  <a
                    className={`${CLASS_NAME}__link`}
                    href={option.linkToRepository}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Take me to the Github repository
                  </a>
                </Text>
              </FlexItem>
            </Panel>
          ))}
        </FlexItem>
      </FlexItem>
    </>
  );
};

export default BreakingTheMonolithOptions;
