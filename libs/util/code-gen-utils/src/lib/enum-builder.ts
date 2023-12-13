import { types } from "recast";
const { builders } = types;

export class EnumBuilder {
  ast: types.namedTypes.TSEnumDeclaration;
  constructor(public readonly enumName: string) {
    this.ast = builders.tsEnumDeclaration(builders.identifier(enumName), []);
  }

  createMember(key: string, value?: string): EnumBuilder {
    this.ast.members.push(
      builders.tsEnumMember(
        builders.identifier(key),
        value ? builders.stringLiteral(value) : undefined
      )
    );

    return this;
  }

  readMember(key: string): types.namedTypes.TSEnumMember | undefined {
    return this.ast.members.find(
      (member) => (member.id as types.namedTypes.Identifier).name === key
    );
  }

  updateMember(key: string, value: string): EnumBuilder {
    const member = this.ast.members.find(
      (member) => (member.id as types.namedTypes.Identifier).name === key
    );
    if (!member) {
      throw new Error(`Member ${key} not found`);
    }
    member.initializer = builders.stringLiteral(value);
    return this;
  }
}
