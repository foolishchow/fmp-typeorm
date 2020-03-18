import { Agent } from "egg";
import { TypeormAgentManager } from "./typeorm/agent";


class FireweedTypeOrmAgent {
  typeormAgentManager: TypeormAgentManager;

  constructor(public app: Agent) {
    this.typeormAgentManager = new TypeormAgentManager(app);
  }

  // 请将你的插件项目中 app.beforeStart 中的代码置于此处。
  async didLoad() {
    // console.info(this.app.config)
    if (this.app.config.typeorm.client || this.app.config.typeorm.clients) {
      await this.typeormAgentManager.init()
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



