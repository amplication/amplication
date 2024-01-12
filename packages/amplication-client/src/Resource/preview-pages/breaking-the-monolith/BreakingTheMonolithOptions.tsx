import React from "react";
import {
  Button,
  EnumFlexDirection,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Panel,
  Text,
} from "@amplication/ui/design-system";
import { MonolithOptions, monolithOptions } from "./monolith-options";
import "./BreakingTheMonolithOptions.scss";
import { match, useHistory } from "react-router-dom";
import { AppRouteProps } from "../../../routes/routesUtil";

const CLASS_NAME = "breaking-the-monolith-options";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
    resource: string;
  }>;
};

const BreakingTheMonolithOptions: React.FC<Props> = ({ match }) => {
  const history = useHistory();
  const {
    workspace: workspaceId,
    project: projectId,
    resource: resourceId,
  } = match.params;

  const convertPathToFileToFile = (selectedMonolith: MonolithOptions): File => {
    const file = new File(
      [selectedMonolith.pathToPrismaSchema],
      selectedMonolith.title
    );
    return file;
  };

  const handleBreakClicked = (selectedMonolithToBreak: MonolithOptions) => {
    console.log("break clicked");
    const file = convertPathToFileToFile(selectedMonolithToBreak);
    history.push(
      `/${workspaceId}/${projectId}/${resourceId}/entities/import-schema`,
      { file: file }
    );
  };

  return (
    <FlexItem className={CLASS_NAME} direction={EnumFlexDirection.Column}>
      {monolithOptions.map((option, index) => (
        <Panel key={index}>
          <FlexItem direction={EnumFlexDirection.Column}>
            <FlexItem>
              <Text textStyle={EnumTextStyle.H2}>{option.title}</Text>
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
              >
                Take me to the Github repository
              </a>
            </Text>
            <Text textStyle={EnumTextStyle.Label}>
              <a
                className={`${CLASS_NAME}__link`}
                href={option.linkToPrismaSchema}
              >
                Show me the schema
              </a>
            </Text>
          </FlexItem>
        </Panel>
      ))}
    </FlexItem>
  );
};

export default BreakingTheMonolithOptions;
