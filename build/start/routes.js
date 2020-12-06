"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
Route_1.default.get('/logout', 'AuthController.logout');
Route_1.default.group(() => {
    Route_1.default.get('/', async ({ view }) => {
        return view.render('login');
    });
    Route_1.default.post('/', 'AuthController.login');
}).prefix('login');
Route_1.default.group(() => {
    Route_1.default.get('/', 'AuthController.index');
    Route_1.default.get('/editar/:id', 'AuthController.edit');
    Route_1.default.get('/apagar/:id', 'AuthController.delete');
    Route_1.default.get('/cadastrar', 'AuthController.create');
    Route_1.default.get('/configuracoes', 'AuthController.config');
    Route_1.default.post('/cadastrar', 'AuthController.register');
    Route_1.default.get('/cargos', 'RolesController.index');
    Route_1.default.get('/cargos/cadastrar', 'RolesController.register');
    Route_1.default.post('/cargos/cadastrar', 'RolesController.create');
    Route_1.default.get('/cargos/apagar/:id', 'RolesController.delete');
    Route_1.default.get('/cargos/editar/:id', 'RolesController.edit');
    Route_1.default.post('/cargos/editar', 'RolesController.update');
}).prefix('usuarios').middleware('auth');
Route_1.default.group(() => {
    Route_1.default.get('/', 'ServicesController.index');
    Route_1.default.post('/editar', 'ServicesController.update');
    Route_1.default.post('/cadastrar', 'ServicesController.create');
    Route_1.default.get('/apagar/:id', 'ServicesController.delete');
}).prefix('servicos').middleware('auth');
Route_1.default.group(() => {
    Route_1.default.get('/', 'BudgetLayoutsController.index');
    Route_1.default.get('/cadastrar', 'BudgetLayoutsController.createForm');
    Route_1.default.post('/cadastrar', 'BudgetLayoutsController.create');
    Route_1.default.get('/editar/:id', 'BudgetLayoutsController.edit');
    Route_1.default.post('/editar', 'BudgetLayoutsController.update');
    Route_1.default.get('/apagar/:id', 'BudgetLayoutsController.delete');
}).prefix('modelos').middleware('auth');
Route_1.default.group(() => {
    Route_1.default.get('/', async ({ view }) => {
        return view.render('rastreamento/painel_rastreamento');
    });
}).prefix('rastreamento').middleware('auth');
Route_1.default.group(() => {
    Route_1.default.get('/agenda', 'OrdersController.schedule');
    Route_1.default.get('/cadastrar/:id', 'OrdersController.register');
    Route_1.default.post('/cadastrar', 'OrdersController.create');
    Route_1.default.get('/editar/:id', 'OrdersController.edit');
    Route_1.default.post('/editar', 'OrdersController.update');
}).prefix('ordens').middleware('auth');
Route_1.default.get('/', async ({ view }) => {
    return view.render('homepage');
}).middleware('auth');
Route_1.default.group(() => {
    Route_1.default.get('cadastrar', 'ClientsController.createForm');
    Route_1.default.post('cadastrar', 'ClientsController.create');
    Route_1.default.get('painel/:id', 'ClientsController.dashboard');
    Route_1.default.get('painel/:id/informacoes', 'ClientsController.informations');
    Route_1.default.get('painel/:id/informacoes/editar', 'ClientsController.edit');
    Route_1.default.post('/informacoes/editar', 'ClientsController.update');
    Route_1.default.get('painel/:id/orcamentos', 'ClientsController.budgets');
    Route_1.default.get('painel/:id/ordens', 'ClientsController.orders');
    Route_1.default.get('painel/:id/historico', 'ClientsController.historic');
    Route_1.default.get('pesquisar', async ({ view }) => {
        return view.render('clientes/pesquisar');
    });
    Route_1.default.post('pesquisar', 'ClientsController.search');
}).prefix('clientes').middleware('auth');
Route_1.default.group(() => {
    Route_1.default.get('cadastrar/:id', 'BudgetsController.register');
    Route_1.default.get('editar/:id', 'BudgetsController.edit');
    Route_1.default.post('editar', 'BudgetsController.update');
    Route_1.default.get('apagar/:id', 'BudgetsController.delete');
    Route_1.default.post('enviar', 'BudgetsController.send');
    Route_1.default.post('cadastrar', 'BudgetsController.create');
}).prefix('orcamentos').middleware('auth');
Route_1.default.group(() => {
    Route_1.default.post('cadastrar', 'HistoricsController.create');
}).prefix('historico').middleware('auth');
//# sourceMappingURL=routes.js.map