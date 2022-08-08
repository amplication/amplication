export class ServiceHash {
    constructor(public pkg: string,
                public folder: string,
                public path: string,
                public hash: string,
                public dependencies: string[]){}
}