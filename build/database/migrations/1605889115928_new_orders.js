"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class Orders extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'orders';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.integer('type', 1);
            table.dateTime('date_time');
            table.integer('budget_id')
                .references('id')
                .inTable('budgets');
            table.integer('service_id')
                .references('id')
                .inTable('services');
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
exports.default = Orders;
//# sourceMappingURL=1605889115928_new_orders.js.map