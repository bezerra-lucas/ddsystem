"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const luxon_1 = require("luxon");
const Service_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Service"));
const Client_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Client"));
const Order_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Order"));
const Address_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Address"));
const Contact_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Contact"));
const Budget_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Budget"));
const Historic_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Historic"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
function onlyAlpha(string) {
    if (string) {
        return string.replace(/\D/g, '');
    }
    else {
        return '';
    }
}
class ClientController {
    async createForm({ view }) {
        const services = await Service_1.default.all();
        return view.render('clientes/cadastrar', {
            services: services,
        });
    }
    async create({ request, response, auth }) {
        var _a, _b, _c, _d, _e, _f, _g;
        const validated = await request.validate({
            schema: Validator_1.schema.create({
                type: Validator_1.schema.string(),
                name: Validator_1.schema.string(),
                cpf: Validator_1.schema.string.optional(),
                cnpj: Validator_1.schema.string.optional(),
                date: Validator_1.schema.string(),
                time: Validator_1.schema.string(),
                service: Validator_1.schema.number(),
                address_count: Validator_1.schema.number(),
                contact_count: Validator_1.schema.number(),
            }),
            messages: {
                required: 'Por favor preencha este campo',
            },
        });
        var client;
        if (validated.type === '0') {
            client = await Client_1.default.create({
                is_pf: true,
                name: validated.name,
                cpf: onlyAlpha(validated.cpf),
                user_id: (_a = auth.user) === null || _a === void 0 ? void 0 : _a.id,
            });
        }
        else {
            client = await Client_1.default.create({
                is_pf: false,
                name: validated.name,
                cnpj: onlyAlpha(validated.cnpj),
                user_id: (_b = auth.user) === null || _b === void 0 ? void 0 : _b.id,
            });
        }
        const date = onlyAlpha(validated.date);
        const time = onlyAlpha(validated.time);
        const day = date.charAt(6) + date.charAt(7);
        const month = date.charAt(4) + date.charAt(5);
        const year = date.charAt(0) + date.charAt(1) + date.charAt(2) + date.charAt(3);
        const hour = time.charAt(0) + time.charAt(1);
        const minute = time.charAt(2) + time.charAt(3);
        const dateTime = luxon_1.DateTime.fromISO(`${year}-${month}-${day}T${hour}:${minute}:00`, { setZone: true });
        const order = await Order_1.default.create({
            type: 0,
            dateTime: dateTime,
            service_id: validated.service,
            client_id: client.id,
            user_id: (_c = auth.user) === null || _c === void 0 ? void 0 : _c.id,
        });
        const budget = await Budget_1.default.create({
            status: 0,
            content: '  ',
            order_id: order.id,
            client_id: client.id,
            user_id: (_d = auth.user) === null || _d === void 0 ? void 0 : _d.id,
        });
        order.budget_id = budget.id;
        await order.save();
        var currentAddresses = 0;
        var currentContacts = 0;
        while (currentContacts <= validated.contact_count - 1) {
            await Contact_1.default.create({
                email: request.input('contact_email' + currentContacts),
                phone: request.input('contact_phone' + currentContacts).replace(/\D/g, ''),
                responsible: request.input('contact_responsible' + currentContacts),
                client_id: client.id,
                user_id: (_e = auth.user) === null || _e === void 0 ? void 0 : _e.id,
            });
            currentContacts++;
        }
        while (currentAddresses <= validated.address_count - 1) {
            await Address_1.default.create({
                street: request.input('address_street' + currentAddresses),
                number: request.input('address_number' + currentAddresses),
                cep: request.input('address_cep' + currentAddresses).replace(/\D/g, ''),
                client_id: client.id,
                user_id: (_f = auth.user) === null || _f === void 0 ? void 0 : _f.id,
            });
            currentAddresses++;
        }
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        today = yyyy + '-' + mm + '-' + dd;
        await Historic_1.default.create({
            date: onlyAlpha(today),
            content: 'Cliente Cadastrado',
            client_id: client.id,
            user_id: (_g = auth.user) === null || _g === void 0 ? void 0 : _g.id,
        });
        return response.redirect('/');
    }
    async update({ view, request, response }) {
        const data = request.all();
        const client = await Client_1.default.find(data.client_id);
        if (client) {
            return response.redirect(`/clientes/painel/${client.id}/informacoes`);
        }
        else {
            return view.render('erros/nao_encontrado', {
                errorMessage: 'O cliente requisitado não foi encontrado na base de dados!',
            });
        }
    }
    async dashboard({ view, response, params }) {
        const client = await Client_1.default.find(params.id);
        if (client) {
            return response.redirect(`/clientes/painel/${client.id}/informacoes`);
        }
        else {
            return view.render('erros/nao_encontrado', {
                errorMessage: 'O cliente requisitado não foi encontrado na base de dados!',
            });
        }
    }
    async informations({ view, params }) {
        const client = await Client_1.default.find(params.id);
        const addresses = await Database_1.default.rawQuery(`
      SELECT *
      FROM addresses
      WHERE client_id = ${client === null || client === void 0 ? void 0 : client.id}
    `);
        const contacts = await Database_1.default.rawQuery(`
      SELECT *
      FROM contacts
      WHERE client_id = ${client === null || client === void 0 ? void 0 : client.id}
    `);
        return view.render('clientes/informacoes', {
            client: client,
            addresses: addresses.rows,
            contacts: contacts.rows,
        });
    }
    async budgets({ view, params }) {
        const client = await Client_1.default.find(params.id);
        const budgets = await Database_1.default.rawQuery(`
      SELECT budgets.id, budgets.status, budgets.created_at, budgets.budget_layout_id, users.id as user_id, users.name as user_name, budget_layouts.name as budget_layouts_name
        FROM budgets
      INNER JOIN users
        ON budgets.user_id = users.id
      INNER JOIN budget_layouts
        ON budget_layout_id = budget_layouts.id
    `);
        return view.render('clientes/orcamentos', {
            client: client,
            budgets: budgets,
        });
    }
    async edit({ view, params }) {
        const client = await Client_1.default.find(params.id);
        return view.render('clientes/editar', {
            client: client,
        });
    }
    async orders({ view, params }) {
        const client = await Client_1.default.find(params.id);
        const orders = await Database_1.default.rawQuery(`
      SELECT orders.*, users.name
      FROM orders
      INNER JOIN users
        ON orders.user_id = users.id
      WHERE orders.client_id = ${client === null || client === void 0 ? void 0 : client.id}
    `);
        const contacts = await Database_1.default.rawQuery(`
      SELECT *
      FROM contacts
      WHERE client_id = ${client === null || client === void 0 ? void 0 : client.id}
    `);
        return view.render('clientes/ordens', {
            client: client,
            orders: orders.rows,
            contacts: contacts.rows,
        });
    }
    async historic({ view, params }) {
        const client = await Client_1.default.find(params.id);
        const historics = await Database_1.default.rawQuery(`
      SELECT *
      FROM historics
      WHERE client_id = ${client === null || client === void 0 ? void 0 : client.id}
    `);
        historics.rows.map(function (historic) {
            historic.date =
                historic.date.charAt(6) +
                    historic.date.charAt(7) +
                    '/' +
                    historic.date.charAt(4) +
                    historic.date.charAt(5) +
                    '/' +
                    historic.date.charAt(0) +
                    historic.date.charAt(1) +
                    historic.date.charAt(2) +
                    historic.date.charAt(3);
        });
        return view.render('clientes/historico', {
            client: client,
            historics: historics.rows,
        });
    }
    async search({ request, view, response }) {
        var results = [];
        var client;
        if (request.input('search_column') === 'id') {
            client = await Client_1.default.find(request.input('search_term'));
            if (client) {
                return response.redirect('/clientes/painel/' + client.id);
            }
            else {
                return view.render('erros/nao_encontrado', {
                    errorMessage: 'Não foi encontrado nenhum resultado para esta pesquisa.',
                    backButtonLink: '/clientes/pesquisar',
                });
            }
        }
        else {
            results = await Database_1.default
                .from('clients')
                .select('*')
                .where(request.input('search_column'), 'LIKE', '%' + request.input('search_term') + '%');
            return view.render('clientes/pesquisar', {
                results: results,
                client: client,
            });
        }
    }
}
exports.default = ClientController;
//# sourceMappingURL=ClientsController.js.map