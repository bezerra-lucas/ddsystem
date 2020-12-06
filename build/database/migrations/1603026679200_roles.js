"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class Roles extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'roles';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.string('name');
            table.boolean('has_permission_to_create_clients');
            table.boolean('has_permission_to_see_client_panel');
            table.boolean('has_permission_to_manage_budgets');
            table.boolean('has_permission_to_manage_budget_layouts');
            table.boolean('has_permission_to_manage_orders');
            table.boolean('has_permission_to_manage_historic');
            table.boolean('has_permission_to_access_gps_tracker');
            table.boolean('has_permission_to_manage_services');
            table.boolean('has_permission_to_manage_users');
            table.timestamps(true);
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = Roles;
//# sourceMappingURL=1603026679200_roles.js.map