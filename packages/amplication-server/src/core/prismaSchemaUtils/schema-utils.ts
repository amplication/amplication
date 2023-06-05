const idTypePropertyMap = {
  autoincrement: { idType: "AUTO_INCREMENT" },
  cuid: { idType: "CUID" },
  uuid: { idType: "UUID" },
};

export function capitalizeFirstLetter(string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function prepareModelAttributes(attributes) {
  if (!attributes && !attributes?.length) {
    return [];
  }
  return attributes.map((attribute) => {
    if (!attribute.arg && !attribute.args?.length) {
      return attribute.kind === "model"
        ? `@@${attribute.name}`
        : `@${attribute.name}`;
    }
    const args = attribute.args.map((arg) => {
      if (typeof arg.value === "object" && arg.value !== null) {
        if (arg.value.type === "array") {
          return `[${arg.value.args.join(", ")}]`;
        } else if (arg.value.type === "keyValue") {
          return `${arg.value.key}: ${arg.value.value}`;
        }
      } else {
        return arg.value;
      }
    });

    return `${attribute.kind === "model" ? "@@" : "@"}${
      attribute.name
    }(${args.join(", ")})`;
  });
}

export function filterOutAmplicatoinAttributes(attributes): string[] {
  // amplication attributes are @id @default @updatedAt @createdAt @relation
  return attributes.filter(
    (attribute) =>
      !attribute.startsWith("@id") &&
      !attribute.startsWith("@default(now())") &&
      !attribute.startsWith("@default(cuid())") &&
      !attribute.startsWith("@default(uuid())") &&
      !attribute.startsWith("@default(autoincrement())") &&
      !attribute.startsWith("@updatedAt") &&
      !attribute.startsWith("@relation")
  );
}

export function createAmplcationFiledProperties(field) {
  const defaultIdAttribute = field.attributes?.find(
    (attr) => attr.name === "default"
  );
  if (!defaultIdAttribute) return;
  return idTypePropertyMap[defaultIdAttribute.args[0].value.name];
}
