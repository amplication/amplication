import { readJson, Tree } from '@nrwl/devkit';



export default async function (tree: Tree, schema: any) {
	const filePath = `libs/${schema.name}/version.ts`;
	const packageJsonPath = `libs/${schema.name}/package.json`;

	const packageJSON = readJson(tree, packageJsonPath);


}


