import React from "react";
import { Button, EnumButtonStyle } from "../Button/Button";
import {
  EnumFlexItemMargin,
  EnumItemsAlign,
  FlexItem,
} from "../FlexItem/FlexItem";
import { Label } from "../Label/Label";
import { Popover } from "../Popover/Popover";
import { LABEL_CLASS } from "../constants";
import "./IconPicker.scss";
import { EnumIconFamily, Icon } from "../Icon/Icon";
import { EnumTextColor } from "../Text/Text";

const CLASS_NAME = "amp-icon-picker";

export type Props = {
  selectedIcon: string;
  onChange: (icon: string) => void;
  label?: string;
  iconOnlyMode?: boolean;
};

export const ICONS = [
  "beaker",
  "cloud-download",
  "code",
  "database",
  "file-binary",
  "file-code",
  "graph",
  "key",
  "keyboard",
  "law",
  "light-bulb",
  "link",
  "mail",
  "package",
  "pulse",
  "rocket",
  "ruby1",
  "server",
  "settings",
  "shield",
  "tag",
  "telescope",
  "tools",
  "1password",
  "algolia",
  "amazonaws",
  "amd",
  "android",
  "angular",
  "ansible",
  "apache",
  "apacheairflow",
  "apachecordova",
  "apacheflink",
  "apachekafka",
  "apachenetbeanside",
  "apacheopenoffice",
  "apacherocketmq",
  "apachespark",
  "apple",
  "auth0",
  "azureartifacts",
  "azuredevops",
  "azurepipelines",
  "babel",
  "bitbucket",
  "bitcoin",
  "cassandra",
  "cisco",
  "cloudflare",
  "codepen",
  "codesandbox",
  "coffeescript",
  "csharp",
  "css3",
  "deno",
  "django",
  "docker",
  "dot-net",
  "drupal",
  "elastic",
  "flask",
  "flutter",
  "git",
  "github",
  "gitlab",
  "gitpod",
  "gitter",
  "go",
  "google",
  "gradle",
  "grafana",
  "graphcool",
  "graphql",
  "gulp",
  "haskell",
  "helm",
  "heroku",
  "html5",
  "ionic",
  "ios",
  "java",
  "javascript",
  "jekyll",
  "jenkins",
  "jest",
  "jira",
  "jquery",
  "jsfiddle",
  "kotlin",
  "kubernetes",
  "laravel",
  "linux",
  "linuxfoundation",
  "mailchimp",
  "microsoft",
  "microsoftazure",
  "mongodb",
  "mysql",
  "neo4j",
  "netlify",
  "next-dot-js",
  "nginx",
  "node-dot-js",
  "npm",
  "nuget",
  "nuxt-dot-js",
  "opensuse",
  "openvpn",
  "oracle",
  "php",
  "postgresql",
  "postman",
  "powershell",
  "prettier",
  "python",
  "pytorch",
  "pyup",
  "r-language",
  "rabbitmq",
  "rails",
  "raspberrypi",
  "react",
  "reactos",
  "redhat",
  "redis",
  "redux",
  "rss",
  "ruby",
  "rust",
  "sass",
  "scala",
  "snyk",
  "sonarqube",
  "stripe",
  "svg",
  "swagger",
  "swift",
  "tailwindcss",
  "terraform",
  "twilio",
  "x-social",
  "typescript",
  "unity",
  "visualstudiocode",
  "webpack",
  "whatsapp",
  "youtube",
];

export const IconPicker: React.FC<Props> = ({
  selectedIcon,
  onChange,
  label,
  iconOnlyMode,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleChange = (icon: string) => {
    setIsOpen(false);
    onChange(icon);
  };

  return (
    <div className={CLASS_NAME}>
      <Popover
        arrow
        open={isOpen}
        placement="bottom-start"
        content={
          <div className={`${CLASS_NAME}__picker`}>
            <div className={`${CLASS_NAME}__picker__icons`}>
              {ICONS.map((iconName) => (
                <Button
                  buttonStyle={EnumButtonStyle.Text}
                  onClick={() => handleChange(iconName)}
                >
                  <Icon
                    key={iconName}
                    icon={iconName}
                    family={EnumIconFamily.Custom}
                    size="medium"
                  />
                </Button>
              ))}
            </div>

            <FlexItem
              className={`${CLASS_NAME}__footer`}
              itemsAlign={EnumItemsAlign.Center}
              margin={EnumFlexItemMargin.Bottom}
              end={
                <Button
                  buttonStyle={EnumButtonStyle.Text}
                  onClick={() => setIsOpen(false)}
                >
                  Close
                </Button>
              }
            ></FlexItem>
          </div>
        }
      >
        <label className={LABEL_CLASS}>
          {label && <Label text={label} />}
          {iconOnlyMode ? (
            <Button
              buttonStyle={EnumButtonStyle.Text}
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              icon="icon"
            />
          ) : (
            <Button
              className={`${CLASS_NAME}__button`}
              buttonStyle={EnumButtonStyle.Outline}
              onClick={() => setIsOpen(!isOpen)}
              type="button"
            >
              <Icon
                icon={selectedIcon}
                family={EnumIconFamily.Custom}
                size="small"
              />
            </Button>
          )}
        </label>
      </Popover>
    </div>
  );
};
