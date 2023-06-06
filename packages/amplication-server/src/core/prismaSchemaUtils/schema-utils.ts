export const idTypePropertyMap = {
  autoincrement: { idType: "AUTO_INCREMENT" },
  cuid: { idType: "CUID" },
  uuid: { idType: "UUID" },
};

export function capitalizeFirstLetter(string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
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
