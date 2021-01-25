"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const midway_1 = require("midway");
function getRepositoryName(model) {
    return model.name.replace(/[A-Z]/, w => w.toLowerCase()) + "Repository";
}
async function getRepository(app, model) {
    let name = getRepositoryName(model);
    return await app.applicationContext.getAsync(name);
}
exports.getRepository = getRepository;
function makeRepository(model) {
    const factory = (context) => {
        let manager = typeorm_1.getConnectionManager();
        let result = undefined;
        manager.connections.forEach(connection => {
            if (result)
                return;
            let repository = connection.getRepository(model);
            if (repository) {
                result = repository;
            }
        });
        return result;
    };
    let name = getRepositoryName(model);
    midway_1.providerWrapper([{
            id: name,
            provider: factory
        }]);
    return factory;
}
exports.makeRepository = makeRepository;
