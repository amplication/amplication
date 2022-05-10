import React from "react";
import Editor from "@monaco-editor/react";

type Props = {
  appId: string;
  buildId: string;
  filePath: string;
};

const CodeViewEditor = ({ appId, buildId, filePath }: Props) => {
  let fileContent: string = "null";
  fileContent =
    "import { ObjectType, Field } from '@nestjs/graphql;import { ActionStep } from './ActionStep';@ObjectType({isAbstract: true})export class Action {@Field(() => String, {nullable: false})id!: string;@Field(() => Date, {nullable: false})createdAt!: Date;@Field(() => [ActionStep], {nullable: true})steps?: ActionStep[] | null | undefined;}";

  return (
    <Editor
      height="90vh"
      defaultLanguage="typescript"
      defaultValue={fileContent}
    />
  );
};

export default CodeViewEditor;
