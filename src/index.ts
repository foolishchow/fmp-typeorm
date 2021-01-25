import { Connection, ConnectionOptions, ConnectionManager, Repository, getConnectionManager, ObjectLiteral } from 'typeorm';
import { providerWrapper, IApplicationContext, Application } from "midway";
export interface TypeormConfig {
  /**
   * @description typeorm conn option
   */
  client?: ConnectionOptions;
  /**
   * @description typeorm conns option
   */
  clients?: {
    [key: string]: ConnectionOptions
  };
}

function getRepositoryName<T extends Function>(model: T) {
  return model.name.replace(/[A-Z]/, w => w.toLowerCase()) + "Repository";
}

export interface Class<T> {
  new(): T;
}
export async function getRepository<T>(app: Application, model: Class<T>): Promise<Repository<T>> {
  let name = getRepositoryName(model);
  return await app.applicationContext.getAsync(name);
}

export function makeRepository<T extends Function>(model: T) {
  const factory = (context: IApplicationContext) => {
    let manager = getConnectionManager();
    let result: any = undefined;
    manager.connections.forEach(connection => {
      if (result) return;
      let repository = connection.getRepository(model as any)
      if (repository) {
        result = repository;
      }
    });
    return result;
  }
  let name = getRepositoryName(model);
  providerWrapper([{
    id: name,
    provider: factory
  }]);
  return factory
}


declare module "egg" {
  export interface Context {
    dataBaseConnections: Connection
    getDataBaseConnection(connectionName?: string): Connection
  }

  export interface WorkerMessenger extends Messenger {
    on(eventname: 'typeorm-synced', listener: (success: boolean) => void): this;
    sendToAgent(action: 'typeorm-sync', data: ConnectionOptions[]): void;
  }

  export interface Application {
    // typeormEntity: Record<string, Record<string, Function>>
    getRepo<T = any>(manager: ConnectionManager, clazz: T): Repository<T>
  }

  export interface AgentMessenger extends Messenger {
    on(eventname: 'typeorm-sync', listener: (info: ConnectionOptions[]) => void): this;
    sendToApp(action: 'typeorm-synced', success: boolean): void;
  }

  export interface Agent {

  }

  export interface EggAppConfig {
    typeorm: TypeormConfig
  }
}
