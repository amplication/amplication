import { useStiggContext } from "@stigg/react-sdk";
import { useEffect, useState } from "react";
import "./PromoBanner.scss";

const CLASS_NAME = "promo-banner";

export const PromoBanner = () => {
  const [isFreePlan, setFreePlan] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(null);

  const { stigg, isInitialized } = useStiggContext();
  const imgSrc =
    "https://static-assets.amplication.com/marketing/banners/promo-banner.png";

  useEffect(() => {
    async function getCustomer() {
      if (isInitialized) {
        const customer = await stigg.getCustomer();
        const subs = customer.getActiveSubscriptions();
        setFreePlan(
          subs.some((sub) => sub.plan.id === "plan-amplication-free")
        );
      }
    }
    getCustomer();
  }, [isInitialized]);

  useEffect(() => {
    const bannerBackgroundImage = new Image();
    bannerBackgroundImage.src = imgSrc;

    bannerBackgroundImage.onload = () => {
      if (
        bannerBackgroundImage.width !== 1 ||
        bannerBackgroundImage.height !== 1
      ) {
        setBackgroundImage(imgSrc);
      } else {
        setBackgroundImage(null);
      }
    };
  }, [imgSrc]);

  return (
    isFreePlan &&
    backgroundImage && (
      <div
        style={{ backgroundImage: `url(${backgroundImage})` }}
        className={CLASS_NAME}
      />
    )
  );
};
