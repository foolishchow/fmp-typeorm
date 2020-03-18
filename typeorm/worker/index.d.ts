import { Application } from "egg";
import { ConnectionOptions } from "typeorm";
import { TypeOrmLogger } from "../utils/logger";
import { TypeormConfig } from "../..";
export declare const SymbolForTypeormConnectionName: unique symbol;
export declare class TypeormWorkerManager {
    worker: Application;
    connectOptions: ConnectionOptions[];
    logger: TypeOrmLogger;
    inited: Function;
    initedPromise: Promise<any>;
    constructor(worker: Application);
    closeAllConnections(): Promise<void>;
    init(): Promise<void>;
    createConnections(): Promise<void>;
    parseConfig(config: TypeormConfig): ConnectionOptions[];
}
