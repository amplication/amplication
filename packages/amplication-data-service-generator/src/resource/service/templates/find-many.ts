declare interface ARGS {}

class FindManyMixin {
  // @ts-ignore
  prisma: {
    DELEGATE: {
      findMany: (args: ARGS) => Promise<ENTITY[]>;
    };
  };
  findMany(args: ARGS): Promise<ENTITY[]> {
    return this.prisma.DELEGATE.findMany(args);
  }
}
