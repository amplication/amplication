import {
  Text,
  EnumFlexDirection,
  EnumGapSize,
  EnumItemsAlign,
  FlexItem,
} from "@amplication/ui/design-system";

const PreviewUserLoginModal = () => {
  return (
    <>
      <FlexItem
        direction={EnumFlexDirection.Column}
        itemsAlign={EnumItemsAlign.Start}
        gap={EnumGapSize.Large}
      >
        <Text>
          Congrats on joining us! With Amplication, you've unlocked streamlined
          backend code generation and boundless possibilities.
        </Text>
        <Text>
          Now, let's dive into your application journey. Explore our intuitive
          interface, craft solutions effortlessly, and enjoy a free 7-day trial
          with unlocked Enterprise features.
        </Text>

        <Text>
          {" Embrace the adventure ahead, and let's create magic together! ✨"}
        </Text>
      </FlexItem>
    </>
  );
};

export default PreviewUserLoginModal;
