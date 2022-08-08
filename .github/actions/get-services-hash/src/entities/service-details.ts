export class ServiceDetails {
    constructor(public folder: string,
                public path: string,
                public pkg: string,
                public dependencies: string[]) {
    }

}