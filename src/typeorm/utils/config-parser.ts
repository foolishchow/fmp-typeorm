import { EggApplication } from "egg";
import { isAbsolute, resolve } from "path";
import { ConnectionOptions } from "typeorm";
import { pure } from ".";
import { TypeormConfig } from "../..";



export function parseSynchronizeTypeormConfig(app: EggApplication, config: TypeormConfig): ConnectionOptions[] {
  let options = parseTypeormConfig(app, config);
  return options.filter(opt => opt.synchronize);
}

export function parseTypeormConfig(app: EggApplication, config: TypeormConfig): ConnectionOptions[] {
  let options: ConnectionOptions[] = [];
  if (config.client) {
    let opt = parseConnectOption(app, config.client)
    options.push(opt);
  } else {
    let configs = config.clients;
    for (let name in configs) {
      let opt = parseConnectOption(app, configs[name], name)
      options.push(opt);
    }
  }
  return options;
}



const parseConnectOption = (
  app: EggApplication,
  option: ConnectionOptions,
  name: string = "default"
) => {
  let fileExt = "/**/*.ts";
  if (app.config.env != "local") {
    fileExt = "/**/*.js";
  }
  option = pure(option);
  if (!option.name) {
    // @ts-ignore
    option.name = name;
  }
  if (!option.entities || option.entities.length == 0) {
    // @ts-ignore
    option.entities = ["app/entities"];
  }
  if (option.entities) {
    // @ts-ignore
    option.entities = option.entities.map(entityPath => {
      if (typeof entityPath == "string" && !isAbsolute(entityPath)) {
        return resolve(app.baseDir, entityPath) + fileExt;
      }
      return entityPath;
    })
  }
  return option;
}

