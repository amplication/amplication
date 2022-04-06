import { Build } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

export const previousBuild = async (
  prisma: PrismaService,
  appId: string,
  newBuildId: string
): Promise<Build | null> => {
  const oldBuild = (
    await prisma.build.findMany({
      take: 1,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      where: { appId: appId, NOT: { id: newBuildId } },
      orderBy: { createdAt: 'desc' }
    })
  )[0];
  return oldBuild || null;
};
