import { Tree } from '@nrwl/devkit';
import { Node, Project } from 'ts-morph';
import * as fse from 'fs-extra';
import * as fs from 'fs';
import * as path from 'path';

export default async function (tree: Tree, schema: any) {

	const pkgName = schema.name;

	const libTsconfig = await fse.readFile(`packages/${pkgName}/tsconfig.lib.json`, 'utf-8');

	const baseUrlPath = path.join(`packages/${pkgName}`, JSON.parse(libTsconfig).compilerOptions.baseUrl || './');

	console.log('baseUrlPath: ', baseUrlPath);

	const project = new Project({
		tsConfigFilePath: `packages/${pkgName}/tsconfig.lib.json`,
	});

	project.addSourceFilesAtPaths(`packages/${pkgName}/**/*.ts`);

	// const sourceFiles = project.getSourceFiles(`packages/amplication-server/src/services/sendgridConfig.service.ts`);
	const sourceFiles = project.getSourceFiles(`packages/${pkgName}/src/**/*.ts`);

	for (let sourceFile of sourceFiles) {
		const filePath = path.relative(process.cwd(), sourceFile.getFilePath());

		const relativePath = path.relative(baseUrlPath, filePath);

		//visit all import declarations
		sourceFile.forEachDescendant((node) => {
			if (Node.isImportDeclaration(node)) {
				const importPath = node.getModuleSpecifierValue();
				// change to relative
				if (importPath.startsWith('src')) {
					const newImportPath = path.relative(path.dirname(relativePath), importPath);
					// color log
					console.log('\x1b[36m%s\x1b[0m', importPath, '->', newImportPath);

					node.setModuleSpecifier(newImportPath);
				} else if (!importPath.startsWith('.')) {
					const existFilePath = path.join(path.dirname(filePath), importPath) + '.ts';
					const stat = fs.existsSync(existFilePath);
					if (stat) {
						console.log('existFilePath: ', existFilePath);
						const newImportPath = './' + importPath;
						// color log
						console.log('\x1b[36m%s\x1b[0m', importPath, '->', newImportPath);

						node.setModuleSpecifier(newImportPath);
					}
				}
				//change to absolute
			}
		});

		await sourceFile.save()
	}
}
