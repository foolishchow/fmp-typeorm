import { Connection, ConnectionOptions, ConnectionManager, Repository } from 'typeorm';
import { IApplicationContext, Application } from "midway";
export interface TypeormConfig {
    /**
     * @description typeorm conn option
     */
    client?: ConnectionOptions;
    /**
     * @description typeorm conns option
     */
    clients?: {
        [key: string]: ConnectionOptions;
    };
}
export declare function getRepository<T extends Function>(app: Application, model: T): Promise<Repository<T>>;
export declare function makeRepository<T extends Function>(model: T): (context: IApplicationContext) => any;
declare module "egg" {
    interface Context {
        dataBaseConnections: Connection;
        getDataBaseConnection(connectionName?: string): Connection;
    }
    interface WorkerMessenger extends Messenger {
        on(eventname: 'typeorm-synced', listener: (success: boolean) => void): this;
        sendToAgent(action: 'typeorm-sync', data: ConnectionOptions[]): void;
    }
    interface Application {
        getRepo<T = any>(manager: ConnectionManager, clazz: T): Repository<T>;
    }
    interface AgentMessenger extends Messenger {
        on(eventname: 'typeorm-sync', listener: (info: ConnectionOptions[]) => void): this;
        sendToApp(action: 'typeorm-synced', success: boolean): void;
    }
    interface Agent {
    }
    interface EggAppConfig {
        typeorm: TypeormConfig;
    }
}
