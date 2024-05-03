import { VariableDictionary } from "@amplication/code-gen-types";
import { extractVariablesFromCode, sortAlphabetically } from "./dotenv";

describe("sortAlphabetically", () => {
  test("sort env variables in alphabetical order", () => {
    const expected: VariableDictionary = [
      { A: "A_value" },
      { B: "B_value" },
      { C: "C_value" },
      { D: "D_value" },
      { E: "E_value" },
    ];

    const envVariables: VariableDictionary = [
      { B: "B_value" },
      { C: "C_value" },
      { E: "E_value" },
      { A: "A_value" },
      { D: "D_value" },
    ];
    expect(sortAlphabetically(envVariables)).toStrictEqual(expected);
  });
});

describe("extractVariablesFromCode", () => {
  test("extracts env varibles from code", () => {
    const expected = [
      { B: "B_value" },
      { C: "C_value" },
      { A: "A_value" },
      { D: "D_value" },
      { E: "E_value" },
    ];

    const envVariableCode = `
B=B_value
C=C_value
A=A_value
D=D_value
E=E_value
        `;
    expect(extractVariablesFromCode(envVariableCode)).toStrictEqual(expected);
  });
});
