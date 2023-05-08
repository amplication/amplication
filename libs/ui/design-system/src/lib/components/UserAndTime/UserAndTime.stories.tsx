import React from "react";
import { Meta } from "@storybook/react";
import { UserAndTime } from "./UserAndTime";

export default {
  title: "UserAndTime",
  component: UserAndTime,
} as Meta;

const SAMPLE_DATE = new Date();
SAMPLE_DATE.setHours(SAMPLE_DATE.getHours() - 2);

export const Default = (props: any) => {
  return (
    <UserAndTime
      time={SAMPLE_DATE}
      account={{
        firstName: "aaa",
        lastName: "bbb",
      }}
    />
  );
};
