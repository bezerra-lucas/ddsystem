"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const luxon_1 = require("luxon");
const Order_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Order"));
const Client_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Client"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
function onlyAlpha(string) {
    if (string) {
        return string.replace(/\D/g, '');
    }
    else {
        return '';
    }
}
class OrdersController {
    async register({ view, params }) {
        const client = await Client_1.default.find(params.id);
        return view.render('ordens/cadastrar', {
            client: client,
        });
    }
    async schedule({ view }) {
        const orders = await Database_1.default.rawQuery(`
      SELECT clients.name as title, clients.id as client_id, orders.date_time, orders.type, orders.id
      FROM orders
      INNER JOIN clients
      ON orders.client_id = clients.id
    `);
        const green = '#2e7d32';
        const blue = '#0288d1';
        const orange = '#ef6c00';
        orders.rows.map(function (order) {
            order.start = order.date_time;
            switch (order.type) {
                case 0:
                    order.backgroundColor = blue;
                    break;
                case 1:
                    order.backgroundColor = green;
                    break;
                case 2:
                    order.backgroundColor = orange;
                    break;
            }
        });
        return view.render('ordens/agenda', {
            orders: JSON.stringify(orders.rows),
        });
    }
    async edit({ view, params }) {
        const id = params.id;
        const order = await Order_1.default.find(id);
        if (order) {
            const client = await Client_1.default.find(order.client_id);
            const date = order.dateTime.year + order.dateTime.month + order.dateTime.day;
            const time = order.dateTime.hour + order.dateTime.minute;
            return view.render('ordens/editar', {
                order: order,
                client: client,
                date: date,
                time: time,
            });
        }
        else {
            return view.render('erros/nao_encontrado', {
                errorMessage: 'A ordem requisitada não foi encontrada na base de dados!',
            });
        }
    }
    async update({ request, response, view }) {
        const data = request.all();
        const order = await Order_1.default.find(data.order_id);
        if (order) {
            const date = onlyAlpha(data.order_date);
            const time = onlyAlpha(data.order_time);
            const day = date.charAt(6) + date.charAt(7);
            const month = date.charAt(4) + date.charAt(5);
            const year = date.charAt(0) + date.charAt(1) + date.charAt(2) + date.charAt(3);
            const hour = time.charAt(0) + time.charAt(1);
            const minute = time.charAt(2) + time.charAt(3);
            order.dateTime = luxon_1.DateTime.fromISO(`${year}-${month}-${day}T${hour}:${minute}:00`, { setZone: true });
            await order.save();
            return response.redirect(`/clientes/painel/${order.client_id}/ordens`);
        }
        else {
            return view.render('erros/nao_encontrado', {
                errorMessage: 'A ordem requisitada não foi encontrada na base de dados!',
            });
        }
    }
}
exports.default = OrdersController;
//# sourceMappingURL=OrdersController.js.map