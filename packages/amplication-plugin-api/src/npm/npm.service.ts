import { Injectable } from "@nestjs/common";
import fetch, { Response } from "node-fetch";
import { Packument, packument } from "pacote";
import { NpmDownloads } from "src/plugin/plugin.types";

const downloadsCountUrl = "https://api.npmjs.org/downloads/point/";

interface Downloads {
  downloads: number;
  start: string;
  end: string;
  package: string;
}

enum Period {
  LAST_DAY = "last-day",
  LAST_WEEK = "last-week",
  LAST_MONTH = "last-month",
  LAST_YEAR = "last-year",
}

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

  public fetchPackagePackument(packageName: string): Promise<Packument> {
    return packument(packageName, {
      fullMetadata: true,
      fetchRetries: 2,
    });
  }

  public fetchPackageDownloads(
    packageName: string,
    period?: Period
  ): Promise<NpmDownloads> {
    return fetch(
      `${downloadsCountUrl}${period || Period.LAST_WEEK}/${packageName}`,
      { headers: { "content-type": "application/json" } }
    ).then((response) => response.json());
  }
}
