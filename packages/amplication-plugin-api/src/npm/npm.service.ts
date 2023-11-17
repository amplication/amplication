import { Injectable } from "@nestjs/common";
import { Packument, packument } from "pacote";

@Injectable()
export class NpmService {
  public async getPackagePackument(packageName: string): Promise<Packument> {
    const npmPackument = await packument(packageName, {
      fullMetadata: true,
      fetchRetries: 2,
    });

    if (!npmPackument) throw `Plugin ${packageName} doesn't have npm versions`;

    return npmPackument;
  }
}
