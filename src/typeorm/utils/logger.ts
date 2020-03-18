import { Application, Agent } from "egg";
import { Logger, QueryRunner } from "typeorm"

import { EggLogger } from "egg-logger";

class FwfLogger {

  private logger: EggLogger;
  prefix: string;
  constructor(
    app: Application | Agent,
    worker: boolean,
    name: string
  ) {
    this.prefix = `${worker ? "[Worker]" : "[Agent] "} [${name}]`;
    this.logger = app.getLogger(name) || app.logger;
  }
  error(msg: any, ...args: any[]) {
    this.logger.error(this.prefix, ...[msg, ...args]);
  }
  warn(msg: any, ...args: any[]) {
    this.logger.warn(this.prefix, ...[msg, ...args]);
  }
  info(msg: any, ...args: any[]) {
    this.logger.info(this.prefix, ...[msg, ...args]);
  }
  debug(msg: any, ...args: any[]) {
    this.logger.debug(this.prefix, ...[msg, ...args]);
  }
}

const t = "egg-typeorm";
export class TypeOrmLogger implements Logger {
  logger: FwfLogger;

  constructor(
    private app: Application | Agent,
    worker: boolean
  ) {
    this.logger = new FwfLogger(app, worker, "typeorm")
  }


  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any;
  logQuery(o: string, s?: any[]) {
    const n = o + (s && s.length ? " -- PARAMETERS: " + this.stringifyParams(s) : "");
    this.logger.info(n)
  }

  /**
     * Logs query that is failed.
     */
  logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner): any;
  logQueryError(o: string, s: string, i?: any[]) {
    const r = s + (i && i.length ? " -- PARAMETERS: " + this.stringifyParams(i) : "");
    this.logger.error(`[${t}] ${r}: ${o}`)
  }

  /**
  * Logs query that is slow.
  */
  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): any;
  logQuerySlow(o: number, s: string, i?: any[]) {
    let r = s + (i && i.length ? " -- PARAMETERS: " + this.stringifyParams(i) : "");
    this.logger.info(`[${t}](${o}ms) ${r}`)
  }

  /**
   * Logs events from the schema build process.
   */
  logSchemaBuild(message: string, queryRunner?: QueryRunner): any;
  logSchemaBuild(o: string) {
    this.logger.info(o)
  }

  /**
   * Logs events from the migrations run process.
   */
  logMigration(message: string, queryRunner?: QueryRunner): any;
  logMigration(o: string) {
    this.logger.info(o)
  }
  /**
   * Perform logging using given logger, or by default to the console.
   * Log has its own level and message.
   */
  log(level: "log" | "info" | "warn", message: any, queryRunner?: QueryRunner): any;
  log(o: "log" | "info" | "warn", s: any) {
    const {
      app: i
    } = this;
    switch (o) {
      case "log":
        this.logger.info(s);
        break;
      case "info":
        this.logger.info(s);
        break;
      case "warn":
        this.logger.warn(s)
    }
  }

  stringifyParams(params: any[]) {
    try {
      let json = params.map(param => {
        if ("string" == typeof t && t.length > 255) {
          return `${param.substr(0, 255)}...`
        }
        return param;
      })
      return JSON.stringify(json)
    } catch (o) {
      return params
    }
  }
}
