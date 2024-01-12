import React from "react";
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
          choose an open-source monolith, represented its its database schema
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
                <Text textStyle={EnumTextStyle.H3}>{option.title}</Text>
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
              <Text textStyle={EnumTextStyle.Label}>
                <a
                  className={`${CLASS_NAME}__link`}
                  href={option.linkToPrismaSchema}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Show me the schema
                </a>
              </Text>
            </FlexItem>
          </Panel>
        ))}
      </FlexItem>
    </FlexItem>
  );
};

export default BreakingTheMonolithOptions;
