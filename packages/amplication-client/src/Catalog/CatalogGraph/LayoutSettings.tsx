import React from "react";
import { LayoutOptions } from "./types";
import {
  Button,
  EnumButtonStyle,
  EnumFlexDirection,
  FlexItem,
  Popover,
  SelectPanel,
  TextInput,
  Text,
  EnumTextStyle,
  Label,
  Tooltip,
} from "@amplication/ui/design-system";
import "./LayoutSettings.scss";

const CLASS_NAME = "catalog-graph-layout-settings";

export type Props = {
  layoutOptions: LayoutOptions;
  onChange: (layoutOptions: LayoutOptions) => void;
};

export const LayoutSettings: React.FC<Props> = ({
  layoutOptions,
  onChange,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className={CLASS_NAME}>
      <Popover
        onClose={() => setIsOpen(false)}
        arrow
        open={isOpen}
        placement="bottom-start"
        content={
          <div className={`${CLASS_NAME}__picker`}>
            <FlexItem direction={EnumFlexDirection.Column}>
              <Text textStyle={EnumTextStyle.H4}>Layout Settings</Text>

              <TextInput
                label="Node spacing"
                value={layoutOptions.nodeSpacing}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const { value } = event.target;
                  onChange({ nodeSpacing: Number(value) });
                }}
              ></TextInput>
              <TextInput
                label="Layers spacing"
                value={layoutOptions.layersSpacing}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const { value } = event.target;
                  onChange({ layersSpacing: Number(value) });
                }}
              ></TextInput>
              <Label text="Layers direction" />
              <SelectPanel
                buttonProps={{
                  buttonStyle: EnumButtonStyle.Text,
                }}
                label="Direction"
                onChange={(value: any) => {
                  onChange({ layersDirection: value });
                }}
                selectedValue={layoutOptions.layersDirection}
                options={[
                  { value: "UP", label: "Up" },
                  { value: "DOWN", label: "Down" },
                  { value: "LEFT", label: "Left" },
                  { value: "RIGHT", label: "Right" },
                ]}
              ></SelectPanel>
            </FlexItem>
          </div>
        }
      >
        <Tooltip title="Layout settings" direction="s">
          <Button
            buttonStyle={EnumButtonStyle.Text}
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            icon="app-settings"
          />
        </Tooltip>
      </Popover>
    </div>
  );
};
