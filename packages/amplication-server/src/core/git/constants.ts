//do not override files in 'server/src/[entity]/[entity].[controller/resolver/service/module].ts'
//do not override server/scripts/customSeed.ts
export const doNotOverrideRegexPatterns = [
  /^server\/src\/[^\/]+\/.+\.controller.ts$/,
  /^server\/src\/[^\/]+\/.+\.resolver.ts$/,
  /^server\/src\/[^\/]+\/.+\.service.ts$/,
  /^server\/src\/[^\/]+\/.+\.module.ts$/,
  /^server\/scripts\/customSeed.ts$/
];
