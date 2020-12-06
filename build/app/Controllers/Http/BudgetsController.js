"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Mail_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Addons/Mail"));
const Client_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Client"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const Budget_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Budget"));
const Order_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Order"));
var fs = require('fs');
var pdf = require('html-pdf');
function generateRandomString() {
    var random = Math.random() * (9999999999999 - 0);
    return (random.toString().replace(/\D/g, ''));
}
class BudgetsController {
    async register({ view, params }) {
        function returnError() {
            return view.render('erros/nao_encontrado', {
                errorMessage: 'O cliente requisitado não foi encontrado na base de dados!',
            });
        }
        if (params.id.length < 5) {
            const client = await Client_1.default.find(params.id);
            const layouts = await Database_1.default.rawQuery(`
        SELECT * FROM budget_layouts
      `);
            if (client) {
                return view.render('orcamentos/cadastrar', {
                    client: client,
                    layouts: layouts.rows,
                });
            }
            else {
                return returnError();
            }
        }
        else {
            return returnError();
        }
    }
    async create({ request, response, view, auth }) {
        var _a;
        const data = request.all();
        try {
            const client = await Client_1.default.find(data.client_id);
            if (client) {
                await Budget_1.default.create({
                    status: 0,
                    content: data.budget_content,
                    client_id: client.id,
                    user_id: (_a = auth.user) === null || _a === void 0 ? void 0 : _a.id,
                    budget_layout_id: data.budget_layout_id,
                });
                return response.redirect('/clientes/painel/' + client.id + '/orcamentos');
            }
            else {
                return view.render('erros/nao_encontrado', {
                    errorMessage: 'O cliente requisitado não foi encontrado na base de dados!',
                });
            }
        }
        catch (err) {
            return view.render('erros/nao_encontrado', {
                errorMessage: 'Ocorreu um erro: ' + err,
            });
        }
    }
    async delete({ params, response, view }) {
        const budget = await Budget_1.default.find(params.id);
        if (budget) {
            await budget.delete();
            return response.redirect('back');
        }
        else {
            return view.render('erros/nao_encontrado', {
                errorMessage: 'O cliente requisitado não foi encontrado na base de dados!',
            });
        }
    }
    async edit({ view, params }) {
        const budget = await Budget_1.default.find(params.id);
        const client = await Client_1.default.find(budget === null || budget === void 0 ? void 0 : budget.client_id);
        const layouts = await Database_1.default.rawQuery(`
      SELECT * FROM budget_layouts
    `);
        return view.render('orcamentos/editar', {
            budget: budget,
            client: client,
            layouts: layouts.rows,
        });
    }
    async update({ response, request }) {
        const data = request.all();
        const budget = await Budget_1.default.find(data.budget_id);
        const client = await Client_1.default.find(budget === null || budget === void 0 ? void 0 : budget.client_id);
        if (budget) {
            budget.content = data.budget_content;
            budget.budget_layout_id = data.content;
            await budget.save();
        }
        return response.redirect(`/clientes/painel/${client === null || client === void 0 ? void 0 : client.id}/ordens`);
    }
    async send({ response, view, request }) {
        const order = await Order_1.default.find(request.input('order_id'));
        const budget = await Budget_1.default.findBy('order_id', order === null || order === void 0 ? void 0 : order.budget_id);
        if (budget) {
            var filename = generateRandomString();
            var fileExists = true;
            while (fileExists === true) {
                if (fs.existsSync(`./temp/${filename}.pdf`)) {
                    filename = generateRandomString();
                }
                else {
                    var fileExists = false;
                }
            }
            const path = `./temp/${filename}.pdf`;
            pdf.create(budget.content, {
                format: 'Letter',
                orientation: 'portrait',
                'border': {
                    'right': '0.75in',
                    'left': '0.75in',
                    'bottom': '1in',
                    'top': '1in',
                },
            }).toFile(path, async (err, res) => {
                if (err) {
                    return console.log(err);
                }
                await Mail_1.default.send((message) => {
                    message
                        .from('1lcs.bzrr@gmail.com')
                        .to('1lcs.bzrr@gmail.com')
                        .subject('Orçamento - Osaka Dedetizadora')
                        .htmlView('emails/orcamento', {
                        budget_content: budget.content,
                    })
                        .attach(res.filename, {
                        filename: filename + '.pdf',
                    });
                });
            });
            response.redirect('back');
        }
        else {
            return view.render('erros/nao_encontrado', {
                errorMessage: 'O orçamento requisitado não foi encontrado na base de dados!',
            });
        }
    }
}
exports.default = BudgetsController;
//# sourceMappingURL=BudgetsController.js.map