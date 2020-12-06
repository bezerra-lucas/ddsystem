"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class Budgets extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'budgets';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.integer('status');
            table.text('content');
            table.integer('order_id')
                .references('id')
                .inTable('orders')
                .notNullable();
            table.integer('budget_layout_id')
                .references('id')
                .inTable('budget_layouts');
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
exports.default = Budgets;
//# sourceMappingURL=1604327311969_budgets.js.map