"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const Role_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Role"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
class AuthController {
    async index({ view }) {
        const users = await Database_1.default.rawQuery(`
      SELECT users.name, users.email, users.id, users.role_id, roles.name as roles_name
      FROM users
      INNER JOIN roles
      ON users.role_id = roles.id
    `);
        return view.render('usuarios/index', {
            users: users,
        });
    }
    async register({ request, response }) {
        const data = request.all();
        try {
            await User_1.default.create({
                name: data.name,
                email: data.email,
                password: data.password,
                role_id: data.role_id,
            });
        }
        catch (err) {
            return response.send(err);
        }
        return response.redirect('/usuarios');
    }
    async login({ auth, request, response }) {
        const email = request.input('email');
        const password = request.input('password');
        await auth.attempt(email, password);
        response.redirect('/');
    }
    async logout({ auth, response }) {
        await auth.logout();
        return response.redirect('/login');
    }
    async delete({ params, response, view }) {
        const user = await User_1.default.find(params.id);
        if (user) {
            await user.delete();
            return response.redirect('back');
        }
        else {
            return view.render('erros/nao_encontrado', {
                errorMessage: 'Usuário não encontrado.',
                backButtonLink: '/usuarios',
            });
        }
    }
    async edit({ params, view }) {
        const user = await User_1.default.find(params.id);
        return view.render('usuarios/editar', {
            user: user,
        });
    }
    async create({ view }) {
        const roles = await Role_1.default.all();
        return view.render('usuarios/cadastrar', {
            roles: roles,
        });
    }
    async config({ view }) {
        return view.render('usuarios/configuracoes');
    }
}
exports.default = AuthController;
//# sourceMappingURL=AuthController.js.map