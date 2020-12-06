"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class Historics extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'historics';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.string('date');
            table.string('content');
            table.integer('client_id')
                .notNullable()
                .references('id')
                .inTable('clients');
            table.integer('user_id')
                .notNullable()
                .references('id')
                .inTable('users');
            table.timestamps(true);
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = Historics;
//# sourceMappingURL=1604409798031_historics.js.map