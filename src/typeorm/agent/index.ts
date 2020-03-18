import { Agent } from "egg";
import * as typeorm from "typeorm";
import { ConnectionOptions } from "typeorm";
import { TypeOrmLogger } from "../utils/logger";
import { parseSynchronizeTypeormConfig } from "../utils/config-parser";
import { WeakEqual, pure } from "../utils";


export class TypeormAgentManager {
  currentConfig: ConnectionOptions[] = [];
  quenedConfig: ConnectionOptions[][] = [];
  currentSynced: boolean = false;
  syncing: boolean = false;
  synced: boolean = false;
  logger: TypeOrmLogger;

  constructor(private agent: Agent) {
    this.logger = new TypeOrmLogger(agent, false)
  }

  async doSynchronizeOnCreate() {
    let options = parseSynchronizeTypeormConfig(this.agent, this.agent.config.typeorm);
    if (options.length > 0) {
      this.currentConfig = options;
      this.createSyncConnection();
    }
  }

  async init() {
    this.doSynchronizeOnCreate();
    // this.agent.messenger.on("typeorm-sync", configs => {
    //   this.logger.logQuery("recieved typeorm-sync signal")
    //   if (this.agent.config.env == "local") {
    //     this.updateConfig(configs)
    //   } else {
    //     if (!this.synced) {
    //       this.updateConfig(configs)
    //     }
    //   }
    // });
  }

  async updateConfig(configs: ConnectionOptions[]) {
    if (WeakEqual(this.currentConfig, configs)) {
      if (!this.syncing) {
        this.agent.messenger.sendToApp("typeorm-synced", true);
      }
    } else {
      if (!this.syncing) {
        this.currentConfig = configs;
        this.createSyncConnection();
      } else {
        this.quenedConfig.push(configs);
      }
    }
  }

  async createSyncConnection() {
    if (this.syncing) return;
    this.syncing = true;
    let options = pure(this.currentConfig);
    options.forEach(option => {
      // @ts-ignore
      option.logger = this.logger;
    })
    let connections = await typeorm.createConnections(options);
    for (let connection of connections) {
      let result: { result: number }[] = await connection.manager.query("select 1 + 1 as result");
      if (result.length && result[0].result == 2) {
        this.agent.logger.info(`[Agent]  [typeorm] synchronize for ${connection.name} is ready`);
      }
      connection.close();
    }
    this.logger.logQuery("finished typeorm-sync ")
    // this.agent.messenger.sendToApp("typeorm-synced", true);
    this.synced = true;
    this.syncing = false;
    this.checkNext();
  }

  private checkNext() {
    if (this.quenedConfig.length) {
      this.currentConfig = this.quenedConfig.shift()!;
      this.createSyncConnection();
    }
  }

}


