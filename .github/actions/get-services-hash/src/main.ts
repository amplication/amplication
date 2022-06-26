import MainLogicService from "./services/main-logic.service";
import HashingService from "./services/hashing.service";
import {Package} from "./entities/package";
import {ServiceDetails} from "./entities/service-details";
import {ServiceHash} from "./entities/service-hash";
const core = require('@actions/core');

try {
    const EE_PATH = `ee/packages`
    const OS_PATH = `packages`
    const WORKING_DIRECTORY = process.env.GITHUB_WORKSPACE || `${process.cwd()}/../../..`
    const IGNORE_FOLDERS = core.getInput('ignore-folders') || ["node_moduls","lib","dist"]
    const IGNORE_FILES_TYPE = core.getInput('ignore-files-type') || ["md","yaml","yml"]
    console.log(`Start creating services hashes`)
    console.log(`EE_PATH: ${EE_PATH}`)
    console.log(`OS_PATH: ${OS_PATH}`)
    console.log(`WORKING_DIRECTORY: ${WORKING_DIRECTORY}`)
    console.log(`IGNORE_FOLDERS: ${IGNORE_FOLDERS}`)
    console.log(`IGNORE_FILES_TYPE: ${IGNORE_FILES_TYPE}`)

    const hashingService = new HashingService()
    const main_logic = new MainLogicService(hashingService)

    const charts: string[] = main_logic.getCharts(WORKING_DIRECTORY)

    const packages: Package[] =
        main_logic.getPackages(WORKING_DIRECTORY,OS_PATH)
            .concat(main_logic.getPackages(WORKING_DIRECTORY,EE_PATH))

    const services: ServiceDetails[] =
        main_logic.getServices(WORKING_DIRECTORY,charts,OS_PATH)
            .concat(main_logic.getServices(WORKING_DIRECTORY,charts,EE_PATH))

    const serviceHashes: ServiceHash[] = main_logic.getServiceHash(packages,services)

    console.log(`The action results payload`, serviceHashes);


    core.setOutput("service_hashes", serviceHashes);
} catch (error){
    core.setFailed(error);
}

