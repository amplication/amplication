interface ARGS {}
interface ENTITY {}

class FindOne {
  // @ts-ignore
  prisma: {
    DELEGATE: {
      findOne: (args: ARGS) => Promise<ENTITY | null>;
    };
  };
  findOne(args: ARGS): Promise<ENTITY | null> {
    return this.prisma.DELEGATE.findOne(args);
  }
}
