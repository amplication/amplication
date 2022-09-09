import { readJson, Tree } from '@nrwl/devkit';

import * as fse from 'fs-extra';


export default async function (tree: Tree, schema: any) {
	const rootTsconfig = readJson(tree, 'tsconfig.base.json');
	rootTsconfig.compilerOptions.paths[`@${schema.name}`] = [`packages/${schema.name}/src/index.ts`];

	tree.write('tsconfig.base.json', JSON.stringify(rootTsconfig, null, 2));

	const workspaceJson = readJson(tree, 'workspace.json');
	workspaceJson.projects[schema.name] = `packages/${schema.name}`;
	tree.write('workspace.json', JSON.stringify(workspaceJson, null, 2));

	//cp tsconfig.lib.json
	await fse.copy(`packages/test/tsconfig.json`, `packages/${schema.name}/tsconfig.json`)
	await fse.copy(`packages/test/tsconfig.lib.json`, `packages/${schema.name}/tsconfig.lib.json`)
	await fse.copy(`packages/test/tsconfig.spec.json`, `packages/${schema.name}/tsconfig.spec.json`)

	await fse.outputFile(`packages/${schema.name}/ng-package.json`, JSON.stringify({
			'$schema': '../../node_modules/ng-packagr/ng-package.schema.json',
			'dest': `../../dist/packages/${schema.name}`,
			'lib': {
				'entryFile': 'src/index.ts'
			}
		}
		, null, 2))

	await fse.outputFile(`packages/${schema.name}/project.json`,
		JSON.stringify(templateProjectFile(schema.name), null, 2))
	await fse.outputFile(`packages/${schema.name}/tsconfig.prod.json`, `{
  "extends": "./tsconfig.lib.json",
  "compilerOptions": {
    "declarationMap": false
  },
  "angularCompilerOptions": {
    "compilationMode": "partial"
  }
}
`)
}


function templateProjectFile(pkgName: string): any {
	return {
		'$schema': '../../node_modules/nx/schemas/project-schema.json',
		'sourceRoot': `packages/${pkgName}/src`,
		'projectType': 'library',
		'targets': {
			'ng-packagr-build': {
				'executor': '@nrwl/angular:ng-packagr-lite',
				'outputs': [`dist/packages/${pkgName}`],
				'options': {
					'project': `packages/${pkgName}/ng-package.json`
				},
				'configurations': {
					'production': {
						'tsConfig': `packages/${pkgName}/tsconfig.lib.prod.json`
					},
					'development': {
						'tsConfig': `packages/${pkgName}/tsconfig.lib.json`
					}
				},
				'defaultConfiguration': 'production'
			},
			'build': {
				'executor': '@nrwl/js:tsc',
				'outputs': [
					'{options.outputPath}'
				],
				'options': {
					'outputPath': `dist/packages/${pkgName}`,
					'tsConfig': `packages/${pkgName}/tsconfig.lib.json`,
					'packageJson': `packages/${pkgName}/package.json`,
					'main': `packages/${pkgName}/src/index.ts`,
					'assets': [
						`packages/${pkgName}/*.md`
					]
				}
			},
			'lint': {
				'executor': '@nrwl/linter:eslint',
				'outputs': [
					'{options.outputFile}'
				],
				'options': {
					'lintFilePatterns': [
						`packages/${pkgName}/**/*.ts`
					]
				}
			},
			test: {
				'executor': '@nrwl/jest:jest',
				'outputs': [
					`coverage/packages/${pkgName}`
				],
				'options': {
					'jestConfig': `packages/${pkgName}/jest.config.ts`,
					'passWithNoTests': true
				}
			}
		},
		'tags': []
	}
}
