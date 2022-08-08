import {existsSync,readdirSync} from "fs";
import {basename} from "path";
import HashingService from "./hashing.service";
import {Package} from "../entities/package";
import {ServiceDetails} from "../entities/service-details";
import {ServiceHash} from "../entities/service-hash";

export default class MainLogicService {
    constructor(private hashingService: HashingService) {
    }

    public getServices: (workingDirectory: string, paths: string[]) => ServiceDetails[] = (workingDirectory: string, paths: string[]): ServiceDetails[] => {
        return paths.map(path => {
            const packageJsonPath = `${workingDirectory}/${path}/package.json`
            if (existsSync(packageJsonPath)) {
                const packageJson = require(packageJsonPath)
                const dependencies = Object.keys(packageJson.dependencies).filter(v => v.startsWith("@amplication"))
                const packageName = packageJson.name
                return new ServiceDetails(
                    basename(path),
                    path,
                    packageName,
                    dependencies
                );
            } else {
                console.warn(`Service package.json not found: ${packageJsonPath}`)
                return null
            }
        }).filter(s => s !== null) as ServiceDetails[]
    }


    public getPackages: (workingDirectory: string, path: string) => Package[] = (workingDirectory: string, path: string): Package[] => {
        const targetPath = `${workingDirectory}/${path}`

        return readdirSync(`${targetPath}`).map(pkg => {
            try {
                const folder = `${targetPath}/${pkg}`
                const packageJson = `${folder}/package.json`
                if (existsSync(packageJson)) {
                    return {
                        serviceFolder: `${path}/${pkg}`,
                        name: require(packageJson).name,
                        hash: this.hashingService.getFolderHash(folder)
                    }
                } else {
                    console.warn(`missing ${packageJson} skipping ${targetPath}`)
                    return null;
                }
            } catch (e) {
                console.error(e)
                return null;
            }
        }).filter(pkg => pkg != null) as Package[];
    }


    public getServiceHash: (packages: Package[], services: ServiceDetails[]) => ServiceHash[] = (packages: Package[], services: ServiceDetails[]): ServiceHash[] => {
        return services.map(service => {
            const serviceHash = packages.find(pkg => pkg.name == service.pkg)?.hash || ""
            const dependenciesHashes = service.dependencies.map(dependencyPackageName => {
                return packages.find(pkg => pkg.name == dependencyPackageName)?.hash || ""
            })
            const hashes: string[] = [serviceHash].concat(dependenciesHashes)

            return {
                ...service,
                hash: this.hashingService.getHash(hashes.join(""))
            };
        })
    }
}