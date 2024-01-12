export type MonolithOptions = {
  title: string;
  description: string;
  linkToRepository: string;
  linkToPrismaSchema: string;
  pathToPrismaSchema: string;
};

export const monolithOptions: MonolithOptions[] = [
  {
    title: "cal.com",
    description: "Scheduling infrastructure for absolutely everyone.",
    linkToRepository: "https://github.com/calcom/cal.com",
    linkToPrismaSchema:
      "https://github.com/calcom/cal.com/blob/main/packages/prisma/schema.prisma",
    pathToPrismaSchema:
      "packages/amplication-client/src/Resource/preview-pages/breaking-the-monolith/schemas/cal.com.prisma",
  },
];
