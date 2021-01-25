import { EggApplication } from "egg";
import { ConnectionOptions } from "typeorm";
import { TypeormConfig } from "../..";
export declare function parseSynchronizeTypeormConfig(app: EggApplication, config: TypeormConfig): ConnectionOptions[];
export declare function parseTypeormConfig(app: EggApplication, config: TypeormConfig): ConnectionOptions[];
