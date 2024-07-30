import { VariableDictionary } from "@amplication/code-gen-types";

function sortAlphabetically(arr: VariableDictionary): VariableDictionary {
  const dict = {};
  arr.forEach((item) => {
    const [currentKey] = Object.keys(item);
    const [currentValue] = Object.values(item);
    dict[currentKey] = currentValue;
  });

  const sorted = Object.keys(dict)
    .sort()
    .reduce((arr, key) => {
      arr.push({ [key]: dict[key] });
      return arr;
    }, []);

  return sorted;
}

function extractVariablesFromCode(code: string): VariableDictionary {
  const arr: VariableDictionary = [];
  code.split("\n").forEach((line) => {
    const content = line.split("=");
    if (!content || content.length != 2) {
      return;
    }

    const [key, value] = content;
    arr.push({ [key]: value });
  });
  return arr;
}

export { extractVariablesFromCode, sortAlphabetically };
