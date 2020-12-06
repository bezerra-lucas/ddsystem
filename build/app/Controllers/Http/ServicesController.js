"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Service_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Service"));
class ServicesController {
    async index({ view }) {
        const services = await Service_1.default.all();
        return view.render('servicos/index', {
            services: services,
        });
    }
    async update({ request, response }) {
        const data = request.all();
        const service = await Service_1.default.find(data.service_id);
        if (service) {
            service.name = data.service_name;
            await service.save();
        }
        return response.redirect('back');
    }
    async create({ request, response, auth }) {
        const data = request.all();
        if (auth.user) {
            try {
                await Service_1.default.create({
                    user_id: auth.user.id,
                    name: data.service_name,
                });
            }
            catch (err) {
                return response.send(err);
            }
        }
        else {
            return response.send('Faça Login Antes de Acessar uma Rota');
        }
        return response.redirect('back');
    }
    async delete({ params, response }) {
        const service = await Service_1.default.find(params.id);
        await (service === null || service === void 0 ? void 0 : service.delete());
        return response.redirect('back');
    }
}
exports.default = ServicesController;
//# sourceMappingURL=ServicesController.js.map