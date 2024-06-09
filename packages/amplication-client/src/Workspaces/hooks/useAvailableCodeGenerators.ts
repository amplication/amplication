import { BillingFeature } from "@amplication/util-billing-types";
import { useStiggContext } from "@stigg/react-sdk";
import { useMemo } from "react";
import { EnumCodeGenerator } from "../../models";

const CODE_GENERATORS = [
  {
    value: EnumCodeGenerator.DotNet,
    label: ".NET",
  },
  {
    value: EnumCodeGenerator.NodeJs,
    label: "Node.js",
  },
];

const useAvailableCodeGenerators = () => {
  const { stigg } = useStiggContext();

  const dotNetGeneratorEntitlement = stigg.getBooleanEntitlement({
    featureId: BillingFeature.CodeGeneratorDotNet,
  });

  const availableCodeGeneratorsReady = useMemo(() => {
    return !dotNetGeneratorEntitlement.isFallback;
  }, [dotNetGeneratorEntitlement]);

  const dotNetGeneratorEnabled = useMemo(() => {
    return dotNetGeneratorEntitlement?.hasAccess ?? false;
  }, [dotNetGeneratorEntitlement]);

  const availableCodeGenerators = useMemo(() => {
    return CODE_GENERATORS.filter((generator) => {
      return (
        generator.value === "NodeJs" ||
        (generator.value === "DotNet" && dotNetGeneratorEnabled)
      );
    });
  }, [dotNetGeneratorEnabled]);

  const defaultCodeGenerator = useMemo(() => {
    //return null as long as we are still waiting for the actual entitlement value
    if (!availableCodeGeneratorsReady) return null;
    //return the first available code generator by the order of the array
    return availableCodeGenerators[0].value;
  }, [availableCodeGenerators, availableCodeGeneratorsReady]);

  return {
    availableCodeGeneratorsReady,
    dotNetGeneratorEnabled,
    availableCodeGenerators,
    defaultCodeGenerator,
  };
};

export default useAvailableCodeGenerators;
