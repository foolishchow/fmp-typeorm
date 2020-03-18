import { Application } from "egg";
import * as typeorm from "typeorm";
import { ConnectionOptions } from "typeorm";
import { TypeOrmLogger } from "../utils/logger";
import { parseTypeormConfig } from "../utils/config-parser";
import { pure } from "../utils";
import { TypeormConfig } from "../..";

export const SymbolForTypeormConnectionName = Symbol.for("fwf#typeorm#connection#name")


export class TypeormWorkerManager {
  connectOptions: ConnectionOptions[] = [];
  logger: TypeOrmLogger;
  // @ts-ignore
  inited: Function;
  initedPromise: Promise<any>;
  constructor(public worker: Application) {
    this.initedPromise = new Promise((r) => {
      this.inited = r;
    });
    this.logger = new TypeOrmLogger(worker, true)
  }

  async closeAllConnections() {
    let connections = typeorm.getConnectionManager().connections;
    for (let connection of connections) {
      await connection.close()
    }
  }

  async init() {
    if (!this.worker.config.typeorm) {
      return;
    }
    let connectOptions = this.parseConfig(this.worker.config.typeorm);
    this.connectOptions = connectOptions;
    // let syncedConnections = connectOptions.filter(opt => opt.synchronize);
    // if (syncedConnections.length) {
    //   this.worker.messenger.on("typeorm-synced", success => {
    //     if (success) this.createConnections();
    //   });
    //   this.worker.messenger.sendToAgent("typeorm-sync", syncedConnections);
    // } else {
    //   this.createConnections()
    // }
    this.createConnections()
    await this.initedPromise;
  }

  async createConnections() {
    await this.closeAllConnections();
    this.connectOptions.forEach(opt => {
      // @ts-ignore
      opt.synchronize = false;
    });
    let options = pure(this.connectOptions);
    options.forEach(option => {
      // @ts-ignore
      if (option.logging) option.logger = this.logger;
    })
    let connections = await typeorm.createConnections(options);
    let connectionNames: string[] = [];
    for (let connection of connections) {
      let result: { result: number }[] = await connection.manager.query("select 1 + 1 as result");
      if (result.length && result[0].result == 2) {
        connectionNames.push(connection.name);
        this.worker.logger.info(`[Worker] [typeorm] connection ${connection.name} is ready`);
      }
    }
    if (this.inited) {
      this.inited();
    }
    // this.worker[SymbolForTypeormConnectionName] = connectionNames;
  }

  parseConfig(config: TypeormConfig): ConnectionOptions[] {
    return parseTypeormConfig(this.worker, config)
  }
}



