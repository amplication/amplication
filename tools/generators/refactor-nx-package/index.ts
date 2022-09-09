import { readJson, Tree } from '@nrwl/devkit';

import * as fse from 'fs-extra';


export default async function (tree: Tree, schema: any) {
	//cp tsconfig.lib.json
	await fse.copy(`libs/test/tsconfig.json`, `packages/${schema.name}/tsconfig.json`)
	await fse.copy(`libs/test/tsconfig.lib.json`, `packages/${schema.name}/tsconfig.lib.json`)
	await fse.copy(`libs/test/tsconfig.spec.json`, `packages/${schema.name}/tsconfig.spec.json`)

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
				'outputs': [`dist/libs/${pkgName}`],
				'options': {
					'project': `libs/${pkgName}/ng-package.json`
				},
				'configurations': {
					'production': {
						'tsConfig': `libs/${pkgName}/tsconfig.lib.prod.json`
					},
					'development': {
						'tsConfig': `libs/${pkgName}/tsconfig.lib.json`
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
