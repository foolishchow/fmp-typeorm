"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const agent_1 = require("./typeorm/agent");
class FireweedTypeOrmAgent {
    constructor(app) {
        this.app = app;
        this.typeormAgentManager = new agent_1.TypeormAgentManager(app);
    }
    // 请将你的插件项目中 app.beforeStart 中的代码置于此处。
    async didLoad() {
        // console.info(this.app.config)
        if (this.app.config.typeorm.client || this.app.config.typeorm.clients) {
            await this.typeormAgentManager.init();
        }
    }
    async willReady() {
        // 请将你的应用项目中 app.beforeStart 中的代码置于此处。
    }
    // 请将您的 app.beforeClose 中的代码置于此处。
    async beforeClose() {
    }
}
module.exports = FireweedTypeOrmAgent;
