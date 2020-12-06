"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class Clients extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'clients';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.boolean('is_pf').notNullable();
            table.string('name', 255).notNullable();
            table.string('cpf', 11);
            table.string('cnpj', 14);
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
exports.default = Clients;
//# sourceMappingURL=1603456855916_clients.js.map