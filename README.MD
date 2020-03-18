# fmp-typeorm

> midway playground for typeorm


# enable in config
- `src/config/plugin.ts`
```typescript
import { EggPlugin } from 'midway';
export default {
  static: true, // default is true
  typeorm: {
    enable: true,
    package: "fmp-typeorm"
  }
} as EggPlugin;
```
- `src/config/config.*.ts`
```typescript
import { EggAppConfig, EggAppInfo, PowerPartial } from 'midway';
export type DefaultConfig = PowerPartial<EggAppConfig>

export default (appInfo: EggAppInfo) => {
  const config = <DefaultConfig>{};
  config.typeorm = {
    client: {
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'database',
      entities: ['models'],
      synchronize: true
    }
  }
  return config;
};

```
- `ts declare`
```typescript
import { Connection, ConnectionOptions, ConnectionManager, Repository, getConnectionManager } from 'typeorm';
interface TypeormConfig {
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
```

# use 
- `models/user.ts`
```typescript
import { makeRepository } from "fmp-typeorm";
import { Entity, PrimaryGeneratedColumn, Column, Repository } from "typeorm";

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  userName: string;

  @Column()
  userEmail: string;

}

export type UserRepository = Repository<User>;

export const factory = makeRepository(User);
```
- `service/home.ts`
```typescript
import { Application } from "egg";
import { config, Context, inject, provide } from "midway";
import { UserRepository } from "../models/user";

@provide()
export class MysqlSlaveStatusService {

  @inject() userRepository: UserRepository;
  @inject() ctx: Context;

  async test() {
    let users = await this.userRepository.find({...})
  }

}
```