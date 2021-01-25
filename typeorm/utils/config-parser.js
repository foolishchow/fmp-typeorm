"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const _1 = require(".");
function parseSynchronizeTypeormConfig(app, config) {
    let options = parseTypeormConfig(app, config);
    return options.filter(opt => opt.synchronize);
}
exports.parseSynchronizeTypeormConfig = parseSynchronizeTypeormConfig;
function parseTypeormConfig(app, config) {
    let options = [];
    if (config.client) {
        let opt = parseConnectOption(app, config.client);
        options.push(opt);
    }
    else {
        let configs = config.clients;
        for (let name in configs) {
            let opt = parseConnectOption(app, configs[name], name);
            options.push(opt);
        }
    }
    return options;
}
exports.parseTypeormConfig = parseTypeormConfig;
const parseConnectOption = (app, option, name = "default") => {
    let fileExt = "/**/*.ts";
    if (process.env.NODE_ENV != "local") {
        fileExt = "/**/*.js";
    }
    option = _1.pure(option);
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
            if (typeof entityPath == "string" && !path_1.isAbsolute(entityPath)) {
                return path_1.resolve(app.baseDir, entityPath) + fileExt;
            }
            return entityPath;
        });
    }
    return option;
};
