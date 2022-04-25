import { Build, PrismaService } from '@amplication/prisma-db';

export const previousBuild = async (
  prisma: PrismaService,
  appId: string,
  newBuildId: string,
  buildDate: Date
): Promise<Build | null> => {
  const oldBuild = (
    await prisma.build.findMany({
      take: 1,
      skip: 0,
      where: {
        appId: appId,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        NOT: { id: newBuildId },
        createdAt: { lt: buildDate }
      },
      orderBy: { createdAt: 'desc' }
    })
  ).shift();
  return oldBuild || null;
};
