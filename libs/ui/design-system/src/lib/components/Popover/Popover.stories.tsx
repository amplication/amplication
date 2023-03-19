import React from "react";
import { Meta } from "@storybook/react";
import { Popover } from "./Popover";
import { Button } from "../Button/Button";

export default {
  title: "Popover",
  component: Popover,
} as Meta;

function CaretSelector(props) {
  const choices = [
    "top",
    "bottom",
    "left",
    "right",
    "left-bottom",
    "left-top",
    "right-bottom",
    "right-top",
    "top-left",
    "bottom-left",
    "top-right",
    "bottom-right",
  ].map((dir) => (
    <label key={dir}>
      <input
        key={dir}
        type="radio"
        name="caret"
        value={dir}
        checked={dir === props.current}
        onChange={() => props.onChange(dir)}
      />{" "}
      {dir}
    </label>
  ));

  return <div>{choices}</div>;
}

export const Default = (props: any) => {
  const [open, setOpen] = React.useState(true);
  const [pos, setPos] = React.useState("top");

  return (
    <div>
      <Button onClick={() => setOpen((open) => !open)}>Open</Button>
      <div style={{ padding: 20 }}>
        <CaretSelector current={pos} onChange={setPos} />
      </div>
      <Popover
        content={
          <div>
            Popover Content
            <br />
            <br />
            <br />
            <br />
            more content
          </div>
        }
        caret={pos}
        open={open}
      >
        hello
      </Popover>
      <div>another div below the popover</div>
    </div>
  );
};
