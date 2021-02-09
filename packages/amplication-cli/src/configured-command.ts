import {Command} from '@oclif/command'
import * as fs from 'fs'
import * as path from 'path'
import DefaultClient from 'apollo-boost'
import * as fetch from 'isomorphic-fetch'

const client = new DefaultClient({
  fetch,
  uri: 'http://localhost:3000/graphql',
})

export abstract class ConfiguredCommand extends Command {
  configJSON: Record<string, any> = {
    asd: 'dsa',
  }

  configChanged = false

  configFilePath = path.join(this.config.configDir, 'config.json')

  client = client

  constructor(...args: [any, any]) {
    super(...args)

    if (!fs.existsSync(this.config.configDir))
      fs.mkdirSync(this.config.configDir, {recursive: true})

    if (fs.existsSync(this.configFilePath))
      this.configJSON = require(this.configFilePath)
  }

  setConfig(key: string, value: any) {
    this.configChanged = true
    this.configJSON[key] = value
  }

  getConfig(key: string) {
    return this.configJSON[key]
  }

  abstract command(): Promise<void>

  async preRun() {}

  async run() {
    await this.preRun()
    await this.command()
    await this.postRun()
  }

  async postRun() {
    if (this.configChanged)
      fs.writeFileSync(this.configFilePath, JSON.stringify(this.configJSON))
  }
}
