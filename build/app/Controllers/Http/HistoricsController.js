"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Historic_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Historic"));
function onlyAlpha(string) {
    if (string) {
        return string.replace(/\D/g, '');
    }
    else {
        return '';
    }
}
class HistoricsController {
    async create({ request, response, auth }) {
        var _a;
        const data = request.all();
        await Historic_1.default.create({
            date: onlyAlpha(data.date),
            content: data.content,
            client_id: data.client_id,
            user_id: (_a = auth.user) === null || _a === void 0 ? void 0 : _a.id,
        });
        return response.redirect('back');
    }
}
exports.default = HistoricsController;
//# sourceMappingURL=HistoricsController.js.map