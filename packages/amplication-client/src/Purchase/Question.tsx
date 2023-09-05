import { Icon } from "@amplication/ui/design-system";
import { Collapse } from "@mui/material";
import { useState } from "react";

import "./Question.scss";

type Props = {
  question: string;
  answer: string | React.ReactNode;
};

const CLASS_NAME = "question";

export const Question = ({ question, answer }: Props) => {
  const [open, setOpen] = useState(false);

  const handleOnCLick = () => {
    setOpen(!open);
  };

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__header`} onClick={handleOnCLick}>
        <div className={`${CLASS_NAME}__header__text`}>{question}</div>
        <Icon icon={open ? "chevron_up" : "chevron_down"} />
      </div>
      <Collapse in={open}>
        <div className={`${CLASS_NAME}__separator`}></div>
        <div className={`${CLASS_NAME}__answer`}>{answer}</div>
      </Collapse>
    </div>
  );
};
