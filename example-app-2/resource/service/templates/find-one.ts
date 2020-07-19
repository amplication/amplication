// @ts-ignore: Cannot find name 'ENTITY'.
function findOne(args: ARGS): Promise<ENTITY | null> {
  // Service class method, this is the service's instance
  // @ts-ignore: 'this' implicitly has type 'any' because it does not have a type annotation.
  return this.prisma.DELEGATE.findOne(args);
}
