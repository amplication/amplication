import MainLogicService from "./services/main-logic.service";
import HashingService from "./services/hashing.service";
import {Package} from "./entities/package";
import {ServiceDetails} from "./entities/service-details";
import {ServiceHash} from "./entities/service-hash";

const core = require('@actions/core');

try {



    const EE_PATH = `ee/packages`
    const OS_PATH = `packages`
    const WORKING_DIRECTORY = process.env.GITHUB_WORKSPACE || `${process.cwd()}/../../../..`
    const HASH_IGNORE = JSON.parse(core.getInput('hash-ignore')) as string[]
    const FOLDERS_TO_HASH = JSON.parse(core.getInput('folders-to-hash')) as string[]

    console.log(`Start creating services hashes`)
    console.log(`EE_PATH: ${EE_PATH}`)
    console.log(`OS_PATH: ${OS_PATH}`)
    console.log(`WORKING_DIRECTORY: ${WORKING_DIRECTORY}`)
    console.log(`HASH_IGNORE:`,HASH_IGNORE)
    console.log(`FOLDERS_TO_HASH: ${FOLDERS_TO_HASH}`)

    const hashingService = new HashingService(HASH_IGNORE)
    const main_logic = new MainLogicService(hashingService)


    const packages: Package[] =
        main_logic.getPackages(WORKING_DIRECTORY,OS_PATH)
            .concat(main_logic.getPackages(WORKING_DIRECTORY,EE_PATH))

    const services: ServiceDetails[] =
        main_logic.getServices(WORKING_DIRECTORY,FOLDERS_TO_HASH)

    const serviceHashes: ServiceHash[] = main_logic.getServiceHash(packages,services)

    console.log(`The action results payload`, serviceHashes);


    core.setOutput("service_hashes", serviceHashes);
} catch (error){
    core.setFailed(error);
}
