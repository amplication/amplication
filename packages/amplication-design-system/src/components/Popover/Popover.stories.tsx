import React from "react";
import { Meta } from "@storybook/react/types-6-0";
import { Popover } from "./Popover";
import { Button } from "../Button/Button";

export default {
  title: "Popover",
  component: Popover,
} as Meta;

export const Default = (props: any) => {
  const [open, setOpen] = React.useState(true);

  return (
    <Popover
      content={
        <div
          style={{
            padding: "20px",
          }}
        >
          Popover Content
        </div>
      }
      align={"left"}
      open={open}
    >
      <Button onClick={() => setOpen((open) => !open)}>Open</Button>
    </Popover>
  );
};
