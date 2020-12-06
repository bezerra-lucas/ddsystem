"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const BudgetLayout_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/BudgetLayout"));
class BudgetLayoutsController {
    async index({ view }) {
        const layouts = await BudgetLayout_1.default.all();
        return view.render('modelos/index', {
            layouts: layouts,
        });
    }
    async create({ request, response, auth }) {
        var _a;
        const budgetSchema = Validator_1.schema.create({
            layout_name: Validator_1.schema.string({}, [
                Validator_1.rules.required(),
            ]),
            layout_content: Validator_1.schema.string({}, [
                Validator_1.rules.required(),
            ]),
        });
        const validated = await request.validate({
            schema: budgetSchema,
        });
        try {
            await BudgetLayout_1.default.create({
                name: validated.layout_name,
                content: validated.layout_content,
                user_id: (_a = auth.user) === null || _a === void 0 ? void 0 : _a.id,
            });
        }
        catch (err) {
            return response.send(err);
        }
        return response.redirect('/modelos');
    }
    async createForm({ view }) {
        return view.render('modelos/cadastrar');
    }
    async delete({ params, response, view }) {
        const id = params.id;
        const layout = await BudgetLayout_1.default.find(id);
        if (layout) {
            await layout.delete();
            return response.redirect('back');
        }
        else {
            return view.render('erros/nao_encontrado', {
                errorMessage: 'O modelo requisitado não foi encontrado na base de dados!',
            });
        }
    }
    async edit({ view, params }) {
        const layout = await BudgetLayout_1.default.find(params.id);
        return view.render('modelos/editar', {
            layout: layout,
        });
    }
    async update({ request, response, view }) {
        const budgetSchema = Validator_1.schema.create({
            layout_name: Validator_1.schema.string({}, [
                Validator_1.rules.required(),
            ]),
            layout_content: Validator_1.schema.string({}, [
                Validator_1.rules.required(),
            ]),
            layout_id: Validator_1.schema.string({}, [
                Validator_1.rules.required(),
            ]),
        });
        const validated = await request.validate({
            schema: budgetSchema,
        });
        const layout = await BudgetLayout_1.default.find(validated.layout_id);
        if (layout) {
            layout.name = validated.layout_name;
            layout.content = validated.layout_content;
            await (layout === null || layout === void 0 ? void 0 : layout.save());
            return response.redirect('/modelos');
        }
        else {
            return view.render('erros/nao_encontrado', {
                errorMessage: 'O modelo requisitado não foi encontrado na base de dados!',
                backButtonLink: '/modelos',
            });
        }
    }
}
exports.default = BudgetLayoutsController;
//# sourceMappingURL=BudgetLayoutsController.js.map