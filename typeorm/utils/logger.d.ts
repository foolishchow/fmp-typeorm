import { Application, Agent } from "egg";
import { Logger, QueryRunner } from "typeorm";
declare class FwfLogger {
    private logger;
    prefix: string;
    constructor(app: Application | Agent, worker: boolean, name: string);
    error(msg: any, ...args: any[]): void;
    warn(msg: any, ...args: any[]): void;
    info(msg: any, ...args: any[]): void;
    debug(msg: any, ...args: any[]): void;
}
export declare class TypeOrmLogger implements Logger {
    private app;
    logger: FwfLogger;
    constructor(app: Application | Agent, worker: boolean);
    logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any;
    /**
       * Logs query that is failed.
       */
    logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner): any;
    /**
    * Logs query that is slow.
    */
    logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): any;
    /**
     * Logs events from the schema build process.
     */
    logSchemaBuild(message: string, queryRunner?: QueryRunner): any;
    /**
     * Logs events from the migrations run process.
     */
    logMigration(message: string, queryRunner?: QueryRunner): any;
    /**
     * Perform logging using given logger, or by default to the console.
     * Log has its own level and message.
     */
    log(level: "log" | "info" | "warn", message: any, queryRunner?: QueryRunner): any;
    stringifyParams(params: any[]): string | any[];
}
export {};
