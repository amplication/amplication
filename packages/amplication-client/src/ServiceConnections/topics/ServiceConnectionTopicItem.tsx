import React from "react";
import { Topic } from "../../models";
import ServiceConnectionTopicItemForm, {
  FormValues,
} from "./ServiceConnectionTopicItemForm";

type Props = {
  topic: Topic;
  onPatterTypeChange: (values: FormValues) => void;
};
export default function ServiceConnectionTopicItem({
  topic,
  onPatterTypeChange,
}: Props) {
  return (
    <div>
      {topic.displayName}
      <br />
      {topic.description}
      <ServiceConnectionTopicItemForm onSubmit={onPatterTypeChange} />
    </div>
  );
}
