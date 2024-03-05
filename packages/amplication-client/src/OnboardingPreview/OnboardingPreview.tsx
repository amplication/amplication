import {
  Button,
  EnumButtonStyle,
  EnumContentAlign,
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumItemsAlign,
  EnumTextAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Text,
} from "@amplication/ui/design-system";
import React, { useCallback, useMemo, useState } from "react";
import "./OnboardingPreview.scss";
import * as models from "../models";

import { ReactComponent as LogoTextual } from "../assets/logo-amplication-white.svg";
import { merge } from "lodash";
import {
  CONFIRMATION_PAGE,
  CREATE_SERVICE_DEFAULT_VALUES,
  PAGES_DATA,
  PAGE_KEYS,
} from "./constants";
import usePlugins from "../Plugins/hooks/usePlugins";
import useOnboardingPreview from "./hooks/useOnboardingPreview";

type Props = {
  workspaceId: string;
  projectId: string;
};

const CLASS_NAME = "onboarding-preview";

const OnboardingPreview: React.FC<Props> = ({ workspaceId, projectId }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pagesData, setPagesData] = useState(PAGES_DATA);
  const [done, setDone] = useState(false);

  const { pluginCatalog } = usePlugins(null, null);

  const { createService, errorCreateService, loadingCreateService } =
    useOnboardingPreview();

  const prepareAndCreateService = useCallback(() => {
    setDone(true);

    const data = CREATE_SERVICE_DEFAULT_VALUES;

    data.resource.project = { connect: { id: projectId } };

    const values = Object.values(pagesData).flatMap((page) =>
      page.items.filter((item) => item.selected).map((item) => item.value)
    );

    merge(data, ...values);

    const pluginIds = new Set(
      Object.values(pagesData).flatMap((page) =>
        page.items
          .filter((item) => item.selected && item.pluginsIds)
          .flatMap((item) => item.pluginsIds)
      )
    );

    const selectedPlugins = Array.from(pluginIds).map(
      (id) => pluginCatalog[id]
    );

    console.log({ selectedPlugins });

    const plugins: models.PluginInstallationCreateInput[] = selectedPlugins.map(
      (plugin) => {
        const version = plugin.versions.find((version) => version.isLatest);

        const pluginCreateInput: models.PluginInstallationCreateInput = {
          pluginId: plugin.pluginId,
          version: version.version,
          settings: version.settings,
          configurations: version.configurations,
          npm: plugin.npm,
          displayName: plugin.name,
          enabled: true,
          resource: {
            connect: {
              id: "",
            },
          },
        };

        return pluginCreateInput;
      }
    );

    data.plugins = {
      plugins,
    };

    createService({
      variables: {
        data,
      },
    });
  }, [createService, pagesData, pluginCatalog]);

  const handleContinueClick = useCallback(() => {
    if (currentPage < PAGE_KEYS.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      prepareAndCreateService();
    }
  }, [prepareAndCreateService, currentPage]);

  const handleBackClick = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);

  const handleItemClick = useCallback(
    (itemIndex: number) => {
      const currentPageKey = PAGE_KEYS[currentPage];
      const newPagesData = { ...pagesData };
      const newItems = [...newPagesData[currentPageKey].items];

      if (!newPagesData[currentPageKey].allowMultipleSelection) {
        newItems.forEach((i, index) => {
          i.selected = false;
        });
        newItems[itemIndex].selected = true;
      } else {
        newItems[itemIndex].selected = !newItems[itemIndex].selected;
      }
      newPagesData[currentPageKey] = {
        ...newPagesData[currentPageKey],
        items: newItems,
      };
      setPagesData(newPagesData);
      if (!newPagesData[currentPageKey].allowMultipleSelection) {
        handleContinueClick();
      } else {
        if (!newItems.some((item) => !item.selected)) {
          handleContinueClick();
        }
      }
    },
    [currentPage, handleContinueClick, pagesData]
  );

  const canContinue = useMemo(() => {
    const currentPageKey = PAGE_KEYS[currentPage];
    const currentPageData = pagesData[currentPageKey];
    const selectedItems = currentPageData.items.filter((item) => item.selected);
    return !currentPageData.selectionRequired || selectedItems.length > 0;
  }, [currentPage, pagesData]);

  const canGoBack = currentPage > 0;

  const currentPageKey = PAGE_KEYS[currentPage];
  const currentPageData = done ? CONFIRMATION_PAGE : pagesData[currentPageKey];

  return (
    <FlexItem
      direction={EnumFlexDirection.Column}
      itemsAlign={EnumItemsAlign.Stretch}
      contentAlign={EnumContentAlign.Start}
    >
      <FlexItem.FlexStart
        alignSelf={EnumContentAlign.Center}
        className={`${CLASS_NAME}__header`}
      >
        <LogoTextual className={`${CLASS_NAME}__header__logo`} />
      </FlexItem.FlexStart>
      <FlexItem
        direction={EnumFlexDirection.Column}
        itemsAlign={EnumItemsAlign.Center}
        contentAlign={EnumContentAlign.Start}
        start={
          <FlexItem
            direction={EnumFlexDirection.Column}
            itemsAlign={EnumItemsAlign.Center}
            margin={EnumFlexItemMargin.Both}
          >
            <Text textStyle={EnumTextStyle.H1} textAlign={EnumTextAlign.Center}>
              {currentPageData.title}
            </Text>
            <Text
              textStyle={EnumTextStyle.Description}
              textAlign={EnumTextAlign.Center}
            >
              {currentPageData.subTitle}
            </Text>
            {currentPageData.allowMultipleSelection && (
              <Text
                textStyle={EnumTextStyle.Description}
                textColor={EnumTextColor.ThemeTurquoise}
                textAlign={EnumTextAlign.Center}
              >
                Select one or more and click Continue
              </Text>
            )}
          </FlexItem>
        }
        className={`${CLASS_NAME}__body`}
      >
        {done ? (
          <FlexItem
            direction={EnumFlexDirection.Column}
            itemsAlign={EnumItemsAlign.Center}
            margin={EnumFlexItemMargin.Both}
          >
            <Text textStyle={EnumTextStyle.H3} textAlign={EnumTextAlign.Center}>
              We are generating your service.
            </Text>
            <Text
              textStyle={EnumTextStyle.Description}
              textAlign={EnumTextAlign.Center}
            >
              You will get an email with a link to a GitHub repo with the
              generated code of your service.
            </Text>
            <span
              role="img"
              aria-label="party emoji"
              className={`${CLASS_NAME}__party`}
            >
              🎉
            </span>
          </FlexItem>
        ) : (
          currentPageData.items.map((item, index) => (
            <Button
              key={`${currentPage}${item.title}`}
              buttonStyle={
                item.selected
                  ? EnumButtonStyle.Primary
                  : EnumButtonStyle.Outline
              }
              onClick={() => {
                handleItemClick(index);
              }}
            >
              <img src={item.icon} alt={item.title} />
              <Text textStyle={EnumTextStyle.H3}>{item.title}</Text>
            </Button>
          ))
        )}
      </FlexItem>

      <FlexItem.FlexEnd className={`${CLASS_NAME}__footer`}>
        {!done && (
          <FlexItem>
            <FlexItem.FlexStart>
              {canGoBack && (
                <Button
                  buttonStyle={EnumButtonStyle.Outline}
                  onClick={handleBackClick}
                  disabled={!canGoBack}
                >
                  Back
                </Button>
              )}
            </FlexItem.FlexStart>
            <FlexItem.FlexEnd>
              <Button
                buttonStyle={EnumButtonStyle.Primary}
                onClick={handleContinueClick}
                disabled={!canContinue}
              >
                {currentPage === PAGE_KEYS.length - 1 ? "Done" : "Continue"}
              </Button>
            </FlexItem.FlexEnd>
          </FlexItem>
        )}
      </FlexItem.FlexEnd>
    </FlexItem>
  );
};

export default OnboardingPreview;
