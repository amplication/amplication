import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateRepoDialogContent from "./CreateRepoDialogContent";
import React from "react";

describe("CreateRepoDialogContent", () => {
  describe("Testing the visualize of the component", () => {
    it("should have the text ", () => {
      render(
        <CreateRepoDialogContent
          appId="id"
          setOpen={() => {}}
          sourceControlService="Github"
        />
      );

      expect(screen.queryByText("Let go!")).toBe("Let go!");
    });
  });
});
