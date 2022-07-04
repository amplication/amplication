import { gql } from "@apollo/client";
import * as models from "../models";

const YELLOW = "#F5B82E";
const RED = "#FF6E6E";
const PINK = "#F685A1";
const TURQUOISE = "#41CADD";
const GREEN = "#8DD9B9";
const BLUE = "#20A4F3";

export const COLORS = [
  {
    value: YELLOW,
    label: "Yellow",
  },
  {
    value: RED,
    label: "Red",
  },
  {
    value: PINK,
    label: "Pink",
  },
  {
    value: TURQUOISE,
    label: "Turquoise",
  },
  {
    value: GREEN,
    label: "Green",
  },
  {
    value: BLUE,
    label: "Blue",
  },
];

export const COLOR_TO_NAME: {
  [key: string]: string;
} = {
  [YELLOW]: "yellow",
  [RED]: "red",
  [PINK]: "pink",
  [TURQUOISE]: "turquoise",
  [GREEN]: "green",
  [BLUE]: "blue",
};

export const sampleServiceResourceWithoutEntities: models.ResourceCreateWithEntitiesInput = {
  resource: {
    name: "My service",
    description: "",
    color: GREEN,
    type: models.EnumResourceType.Service,
  },
  commitMessage: "",
  entities: [],
};

export const sampleServiceResourceWithEntities: models.ResourceCreateWithEntitiesInput = {
  resource: {
    name: "Sample service",
    description: "Sample service for e-commerce",
    color: YELLOW,
    type: models.EnumResourceType.Service,
  },
  commitMessage: "",
  entities: [
    {
      name: "Orders",
      fields: [
        {
          name: "Quantity",
          dataType: models.EnumDataType.WholeNumber,
        },
        {
          name: "Discount",
          dataType: models.EnumDataType.DecimalNumber,
        },
        {
          name: "Total Price",
          dataType: models.EnumDataType.WholeNumber,
        },
      ],
      relationsToEntityIndex: [1, 3],
    },
    {
      name: "Customer",
      fields: [
        {
          name: "First Name",
          dataType: models.EnumDataType.SingleLineText,
        },
        {
          name: "Last Name",
          dataType: models.EnumDataType.SingleLineText,
        },
        {
          name: "Email",
          dataType: models.EnumDataType.Email,
        },
        {
          name: "Phone",
          dataType: models.EnumDataType.SingleLineText,
        },
      ],
      relationsToEntityIndex: [2],
    },
    {
      name: "Address",
      fields: [
        {
          name: "Address 1",
          dataType: models.EnumDataType.SingleLineText,
        },
        {
          name: "Address 2",
          dataType: models.EnumDataType.SingleLineText,
        },
        {
          name: "City",
          dataType: models.EnumDataType.SingleLineText,
        },
        {
          name: "State",
          dataType: models.EnumDataType.SingleLineText,
        },
        {
          name: "Zip",
          dataType: models.EnumDataType.WholeNumber,
        },
      ],
    },
    {
      name: "Product",
      fields: [
        {
          name: "Name",
          dataType: models.EnumDataType.SingleLineText,
        },
        {
          name: "Item Price",
          dataType: models.EnumDataType.DecimalNumber,
        },
        {
          name: "Description",
          dataType: models.EnumDataType.MultiLineText,
        },
      ],
    },
  ],
};

export const GET_APP_SETTINGS = gql`
  query appSettings($id: String!) {
    appSettings(where: { id: $id }) {
      id
      dbHost
      dbName
      dbUser
      dbPassword
      dbPort
      authProvider
    }
  }
`;
