
import { Application } from "egg";
import { TypeormWorkerManager } from "./typeorm/worker";


class FireweedTypeOrmWorker {
  typeormManager: any;
  constructor(public app: Application) {
    this.typeormManager = new TypeormWorkerManager(app);
    app.beforeStart(async () => {
      console.log('🚀 Your awesome APP is launching...');

      await this.typeormManager.init();

      console.log('✅  Your awesome APP launched');
    });
  }

  // 请将你的插件项目中 app.beforeStart 中的代码置于此处。
  async didLoad() {

  }

  // 请将你的应用项目中 app.beforeStart 中的代码置于此处。
  // async willReady() {
  async didReady() {
    // @ts-ignore

  }

  // 请将您的 app.beforeClose 中的代码置于此处。
  async beforeClose() {
    await this.typeormManager.closeAllConnections();
  }

}

module.exports = FireweedTypeOrmWorker;



