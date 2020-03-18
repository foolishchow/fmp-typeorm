"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FwfLogger {
    constructor(app, worker, name) {
        this.prefix = `${worker ? "[Worker]" : "[Agent] "} [${name}]`;
        this.logger = app.getLogger(name) || app.logger;
    }
    error(msg, ...args) {
        this.logger.error(this.prefix, ...[msg, ...args]);
    }
    warn(msg, ...args) {
        this.logger.warn(this.prefix, ...[msg, ...args]);
    }
    info(msg, ...args) {
        this.logger.info(this.prefix, ...[msg, ...args]);
    }
    debug(msg, ...args) {
        this.logger.debug(this.prefix, ...[msg, ...args]);
    }
}
const t = "egg-typeorm";
class TypeOrmLogger {
    constructor(app, worker) {
        this.app = app;
        this.logger = new FwfLogger(app, worker, "typeorm");
    }
    logQuery(o, s) {
        const n = o + (s && s.length ? " -- PARAMETERS: " + this.stringifyParams(s) : "");
        this.logger.info(n);
    }
    logQueryError(o, s, i) {
        const r = s + (i && i.length ? " -- PARAMETERS: " + this.stringifyParams(i) : "");
        this.logger.error(`[${t}] ${r}: ${o}`);
    }
    logQuerySlow(o, s, i) {
        let r = s + (i && i.length ? " -- PARAMETERS: " + this.stringifyParams(i) : "");
        this.logger.info(`[${t}](${o}ms) ${r}`);
    }
    logSchemaBuild(o) {
        this.logger.info(o);
    }
    logMigration(o) {
        this.logger.info(o);
    }
    log(o, s) {
        const { app: i } = this;
        switch (o) {
            case "log":
                this.logger.info(s);
                break;
            case "info":
                this.logger.info(s);
                break;
            case "warn":
                this.logger.warn(s);
        }
    }
    stringifyParams(params) {
        try {
            let json = params.map(param => {
                if ("string" == typeof t && t.length > 255) {
                    return `${param.substr(0, 255)}...`;
                }
                return param;
            });
            return JSON.stringify(json);
        }
        catch (o) {
            return params;
        }
    }
}
exports.TypeOrmLogger = TypeOrmLogger;
