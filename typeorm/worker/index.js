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
exports.SymbolForTypeormConnectionName = Symbol.for("fwf#typeorm#connection#name");
class TypeormWorkerManager {
    constructor(worker) {
        this.worker = worker;
        this.connectOptions = [];
        this.initedPromise = new Promise((r) => {
            this.inited = r;
        });
        this.logger = new logger_1.TypeOrmLogger(worker, true);
    }
    async closeAllConnections() {
        let connections = typeorm.getConnectionManager().connections;
        for (let connection of connections) {
            await connection.close();
        }
    }
    async init() {
        if (!this.worker.config.typeorm) {
            return;
        }
        let connectOptions = this.parseConfig(this.worker.config.typeorm);
        this.connectOptions = connectOptions;
        // let syncedConnections = connectOptions.filter(opt => opt.synchronize);
        // if (syncedConnections.length) {
        //   this.worker.messenger.on("typeorm-synced", success => {
        //     if (success) this.createConnections();
        //   });
        //   this.worker.messenger.sendToAgent("typeorm-sync", syncedConnections);
        // } else {
        //   this.createConnections()
        // }
        this.createConnections();
        await this.initedPromise;
    }
    async createConnections() {
        await this.closeAllConnections();
        this.connectOptions.forEach(opt => {
            // @ts-ignore
            opt.synchronize = false;
        });
        let options = utils_1.pure(this.connectOptions);
        options.forEach(option => {
            // @ts-ignore
            if (option.logging)
                option.logger = this.logger;
        });
        let connections = await typeorm.createConnections(options);
        let connectionNames = [];
        for (let connection of connections) {
            let result = await connection.manager.query("select 1 + 1 as result");
            if (result.length && result[0].result == 2) {
                connectionNames.push(connection.name);
                this.worker.logger.info(`[Worker] [typeorm] connection ${connection.name} is ready`);
            }
        }
        if (this.inited) {
            this.inited();
        }
        // this.worker[SymbolForTypeormConnectionName] = connectionNames;
    }
    parseConfig(config) {
        return config_parser_1.parseTypeormConfig(this.worker, config);
    }
}
exports.TypeormWorkerManager = TypeormWorkerManager;
