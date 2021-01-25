import { Agent } from "egg";
import { ConnectionOptions } from "typeorm";
import { TypeOrmLogger } from "../utils/logger";
export declare class TypeormAgentManager {
    private agent;
    currentConfig: ConnectionOptions[];
    quenedConfig: ConnectionOptions[][];
    currentSynced: boolean;
    syncing: boolean;
    synced: boolean;
    logger: TypeOrmLogger;
    constructor(agent: Agent);
    doSynchronizeOnCreate(): Promise<void>;
    init(): Promise<void>;
    updateConfig(configs: ConnectionOptions[]): Promise<void>;
    createSyncConnection(): Promise<void>;
    private checkNext;
}
