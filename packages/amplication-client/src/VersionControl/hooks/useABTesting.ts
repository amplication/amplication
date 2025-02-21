import { useEffect, useMemo } from "react";
import useLocalStorage from "react-use-localstorage";

const AB_TESTING_VALUE_KEY = "AB_TESTING_VALUE";

type UpgradeCtaTestData = {
  linkMessage: string;
  url: string;
};

const UpgradeCtaTestVariants: UpgradeCtaTestData[] = [
  {
    linkMessage: "Talk to us",
    url: " https://meetings-eu1.hubspot.com/yuval-hazaz",
  },
];

const useAbTesting = () => {
  const [abTestingValue, setAbTestingValue] = useLocalStorage(
    AB_TESTING_VALUE_KEY,
    ""
  );

  const upgradeCtaVariationData = useMemo(() => {
    //calculate the variant based on the number of options and the value
    const variantIndex = Math.floor(
      parseFloat(abTestingValue) * UpgradeCtaTestVariants.length
    );
    return UpgradeCtaTestVariants[variantIndex];
  }, [abTestingValue]);

  useEffect(() => {
    if (!abTestingValue || abTestingValue === "") {
      //set the value to be a random number between 0 and 1
      const randomValue = Math.random();
      setAbTestingValue(randomValue.toString());
    }
  }, [abTestingValue, setAbTestingValue]);

  return {
    upgradeCtaVariationData,
  };
};

export default useAbTesting;
