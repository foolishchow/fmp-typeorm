"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm = __importStar(require("typeorm"));
const logger_1 = require("../utils/logger");
const config_parser_1 = require("../utils/config-parser");
const utils_1 = require("../utils");
class TypeormAgentManager {
    constructor(agent) {
        this.agent = agent;
        this.currentConfig = [];
        this.quenedConfig = [];
        this.currentSynced = false;
        this.syncing = false;
        this.synced = false;
        this.logger = new logger_1.TypeOrmLogger(agent, false);
    }
    async doSynchronizeOnCreate() {
        let options = config_parser_1.parseSynchronizeTypeormConfig(this.agent, this.agent.config.typeorm);
        if (options.length > 0) {
            this.currentConfig = options;
            this.createSyncConnection();
        }
    }
    async init() {
        this.doSynchronizeOnCreate();
        // this.agent.messenger.on("typeorm-sync", configs => {
        //   this.logger.logQuery("recieved typeorm-sync signal")
        //   if (this.agent.config.env == "local") {
        //     this.updateConfig(configs)
        //   } else {
        //     if (!this.synced) {
        //       this.updateConfig(configs)
        //     }
        //   }
        // });
    }
    async updateConfig(configs) {
        if (utils_1.WeakEqual(this.currentConfig, configs)) {
            if (!this.syncing) {
                this.agent.messenger.sendToApp("typeorm-synced", true);
            }
        }
        else {
            if (!this.syncing) {
                this.currentConfig = configs;
                this.createSyncConnection();
            }
            else {
                this.quenedConfig.push(configs);
            }
        }
    }
    async createSyncConnection() {
        if (this.syncing)
            return;
        this.syncing = true;
        let options = utils_1.pure(this.currentConfig);
        options.forEach(option => {
            // @ts-ignore
            option.logger = this.logger;
        });
        let connections = await typeorm.createConnections(options);
        for (let connection of connections) {
            let result = await connection.manager.query("select 1 + 1 as result");
            if (result.length && result[0].result == 2) {
                this.agent.logger.info(`[Agent]  [typeorm] synchronize for ${connection.name} is ready`);
            }
            connection.close();
        }
        this.logger.logQuery("finished typeorm-sync ");
        // this.agent.messenger.sendToApp("typeorm-synced", true);
        this.synced = true;
        this.syncing = false;
        this.checkNext();
    }
    checkNext() {
        if (this.quenedConfig.length) {
            this.currentConfig = this.quenedConfig.shift();
            this.createSyncConnection();
        }
    }
}
exports.TypeormAgentManager = TypeormAgentManager;
