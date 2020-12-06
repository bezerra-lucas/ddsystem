"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class Addresses extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'addresses';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.string('cep', 8);
            table.string('street', 255);
            table.string('number', 20);
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
exports.default = Addresses;
//# sourceMappingURL=1603714502470_addresses.js.map