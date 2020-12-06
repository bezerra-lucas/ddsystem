"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class Contacts extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'contacts';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.string('email', 255);
            table.string('phone', 30);
            table.string('responsible', 90);
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
exports.default = Contacts;
//# sourceMappingURL=1603802824527_contacts.js.map