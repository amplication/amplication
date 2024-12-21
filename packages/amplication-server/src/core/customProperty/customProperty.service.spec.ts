import { Test, TestingModule } from "@nestjs/testing";
import { AmplicationError } from "../../errors/AmplicationError";
import { CustomProperty, Workspace } from "../../models";
import { PrismaService } from "../../prisma/prisma.service";
import { MockedSegmentAnalyticsProvider } from "../../services/segmentAnalytics/tests";
import { prepareDeletedItemName } from "../../util/softDelete";
import { EnumCustomPropertyType } from "./dto/EnumCustomPropertyType";
import { CustomPropertyService } from "./customProperty.service";

const EXAMPLE_CUSTOM_PROPERTY_ID = "exampleCustomPropertyId";
const EXAMPLE_CUSTOM_PROPERTY_KEY = "exampleCustomPropertyKey";
const EXAMPLE_NAME = "exampleName";
const EXAMPLE_WORKSPACE_ID = "exampleWorkspaceId";
const EXAMPLE_CUSTOM_PROPERTY_NAME = "exampleCustomPropertyName";

const EXAMPLE_WORKSPACE: Workspace = {
  id: EXAMPLE_WORKSPACE_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: EXAMPLE_NAME,
  allowLLMFeatures: true,
};

const EXAMPLE_CUSTOM_PROPERTY: CustomProperty = {
  id: EXAMPLE_CUSTOM_PROPERTY_ID,
  name: EXAMPLE_CUSTOM_PROPERTY_NAME,
  createdAt: new Date(),
  updatedAt: new Date(),
  workspace: EXAMPLE_WORKSPACE,
  workspaceId: EXAMPLE_WORKSPACE_ID,
  key: EXAMPLE_CUSTOM_PROPERTY_KEY,
  enabled: true,
  type: EnumCustomPropertyType.Select,
  options: null,
  validationMessage: null,
  validationRule: null,
  required: false,
};

const prismaCustomPropertyUpdateMock = jest.fn(() => {
  return EXAMPLE_CUSTOM_PROPERTY;
});
const prismaCustomPropertyFindFirstMock = jest.fn(() => {
  return EXAMPLE_CUSTOM_PROPERTY;
});
const prismaCustomPropertyCreateMock = jest.fn(() => {
  return EXAMPLE_CUSTOM_PROPERTY;
});
const prismaCustomPropertyFindManyMock = jest.fn(() => {
  return [EXAMPLE_CUSTOM_PROPERTY];
});

const prismaMock = {
  customProperty: {
    create: prismaCustomPropertyCreateMock,
    findMany: prismaCustomPropertyFindManyMock,
    findUnique: prismaCustomPropertyFindFirstMock,
    update: prismaCustomPropertyUpdateMock,
  },
};

describe("CustomPropertyService", () => {
  let service: CustomPropertyService;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomPropertyService,

        {
          provide: PrismaService,
          useValue: prismaMock,
        },

        MockedSegmentAnalyticsProvider(),
      ],
    }).compile();

    service = module.get<CustomPropertyService>(CustomPropertyService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create a customProperty", async () => {
    // arrange
    const args = {
      data: {
        enabled: true,
        key: "EXAMPLE_NAME",
        type: EnumCustomPropertyType.Select,
        name: EXAMPLE_NAME,
        workspace: {
          connect: {
            id: EXAMPLE_WORKSPACE_ID,
          },
        },
      },
    };

    // act
    const newCustomProperty = await service.createCustomProperty(args);

    // assert
    expect(newCustomProperty).toEqual(EXAMPLE_CUSTOM_PROPERTY);
    expect(prismaMock.customProperty.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.customProperty.create).toHaveBeenCalledWith(args);
  });

  it("should delete a customProperty", async () => {
    const args = { where: { id: EXAMPLE_CUSTOM_PROPERTY_ID } };
    const dateSpy = jest.spyOn(global, "Date");
    expect(await service.deleteCustomProperty(args)).toEqual(
      EXAMPLE_CUSTOM_PROPERTY
    );

    expect(prismaMock.customProperty.update).toHaveBeenCalledTimes(1);
    expect(prismaMock.customProperty.update).toHaveBeenCalledWith({
      ...args,
      data: {
        deletedAt: dateSpy.mock.instances[0],
        name: prepareDeletedItemName(
          EXAMPLE_CUSTOM_PROPERTY.name,
          EXAMPLE_CUSTOM_PROPERTY.id
        ),
        key: prepareDeletedItemName(
          EXAMPLE_CUSTOM_PROPERTY.key,
          EXAMPLE_CUSTOM_PROPERTY.id
        ),
      },
    });
  });

  it("should get a single customProperty", async () => {
    const args = { where: { id: EXAMPLE_CUSTOM_PROPERTY_ID } };
    expect(await service.customProperty(args)).toEqual(EXAMPLE_CUSTOM_PROPERTY);
    expect(prismaMock.customProperty.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.customProperty.findUnique).toHaveBeenCalledWith({
      ...args,
      where: {
        ...args.where,
        deletedAt: null,
      },
    });
  });

  it("should find customProperties", async () => {
    const args = {
      where: {
        name: {
          contains: EXAMPLE_CUSTOM_PROPERTY_NAME,
        },
      },
    };
    expect(await service.customProperties(args)).toEqual([
      EXAMPLE_CUSTOM_PROPERTY,
    ]);
    expect(prismaMock.customProperty.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.customProperty.findMany).toHaveBeenCalledWith({
      ...args,
      where: {
        ...args.where,
        deletedAt: null,
      },
    });
  });

  it("should update a customProperty", async () => {
    const args = {
      data: {
        name: EXAMPLE_NAME,
      },
      where: {
        id: EXAMPLE_CUSTOM_PROPERTY_ID,
      },
    };
    expect(await service.updateCustomProperty(args)).toEqual(
      EXAMPLE_CUSTOM_PROPERTY
    );
    expect(prismaMock.customProperty.update).toHaveBeenCalledTimes(1);
    expect(prismaMock.customProperty.update).toHaveBeenCalledWith(args);
  });

  it("should create custom property option", async () => {
    await service.createOption({
      data: {
        customProperty: {
          connect: {
            id: EXAMPLE_CUSTOM_PROPERTY_ID,
          },
        },
        value: "optionValue",
      },
    });

    expect(prismaMock.customProperty.update).toHaveBeenCalledTimes(1);
  });

  it("createOption should throw an exception when custom property not found", async () => {
    prismaMock.customProperty.findUnique.mockReturnValueOnce(null);

    await expect(
      service.createOption({
        data: {
          customProperty: {
            connect: {
              id: EXAMPLE_CUSTOM_PROPERTY_ID,
            },
          },
          value: "optionValue",
        },
      })
    ).rejects.toThrow(
      new AmplicationError(
        `Custom Property not found, ID: ${EXAMPLE_CUSTOM_PROPERTY_ID}`
      )
    );
  });

  it("createOption should throw an exception when property name already being used", async () => {
    prismaMock.customProperty.findUnique.mockReturnValueOnce({
      ...EXAMPLE_CUSTOM_PROPERTY,
      options: [
        {
          value: "existingOptionValue",
          color: "#FFF",
        },
      ],
    });

    const args = {
      data: {
        customProperty: {
          connect: {
            id: EXAMPLE_CUSTOM_PROPERTY_ID,
          },
        },
        value: "existingOptionValue",
      },
    };

    await expect(service.createOption(args)).rejects.toThrow(
      new AmplicationError(
        `Option already exists, name: ${args.data.value}, Custom Property ID: ${args.data.customProperty.connect.id}`
      )
    );
  });

  it("should update custom property option", async () => {
    prismaMock.customProperty.findUnique.mockReturnValueOnce({
      ...EXAMPLE_CUSTOM_PROPERTY,
      options: [
        {
          value: "optionValue",
          color: "#FFF",
        },
      ],
    });

    await service.updateOption({
      where: {
        customProperty: {
          id: EXAMPLE_CUSTOM_PROPERTY_ID,
        },
        value: "optionValue",
      },
      data: {
        value: "optionValue",
        color: "#000",
      },
    });

    expect(prismaMock.customProperty.update).toHaveBeenCalledTimes(1);
  });

  it("should throw an error when updating a missing option", async () => {
    const args = {
      where: {
        customProperty: {
          id: EXAMPLE_CUSTOM_PROPERTY_ID,
        },
        value: "value",
      },
      data: {
        value: "value",
        color: "#000",
      },
    };

    await expect(service.updateOption(args)).rejects.toThrow(
      new AmplicationError(
        `Option not found, name: ${args.where.value}, Custom Property ID: ${args.where.customProperty.id}`
      )
    );
  });

  it("should delete custom property option", async () => {
    prismaMock.customProperty.findUnique.mockReturnValueOnce({
      ...EXAMPLE_CUSTOM_PROPERTY,
      options: [
        {
          value: "optionValue",
          color: "#FFF",
        },
        {
          value: "optionValue2",
          color: "#FFF",
        },
      ],
    });

    await service.deleteOption({
      where: {
        customProperty: {
          id: EXAMPLE_CUSTOM_PROPERTY_ID,
        },
        value: "optionValue",
      },
    });

    expect(prismaMock.customProperty.update).toHaveBeenCalledTimes(1);
    expect(prismaMock.customProperty.update).toHaveBeenCalledWith({
      where: {
        id: EXAMPLE_CUSTOM_PROPERTY_ID,
      },
      data: {
        options: [
          {
            value: "optionValue2",
            color: "#FFF",
          },
        ],
      },
    });
  });
});
