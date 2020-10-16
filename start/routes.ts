import Route from '@ioc:Adonis/Core/Route'

Route.get('/logout', 'AuthController.logout')

Route.group(() => {
  Route.get('/', async ({ view }) => {
    return view.render('login')
  })
  Route.post('/', 'AuthController.login')
}).prefix('login')

Route.group(() => {
  Route.get('/', 'AuthController.index')

  Route.get('/editar/:id', 'AuthController.edit')
  Route.get('/apagar/:id', 'AuthController.delete')
  Route.get('/cadastrar', 'AuthController.create')
  Route.get('/configuracoes', 'AuthController.config')

  Route.post('/cadastrar', 'AuthController.register')
}).prefix('usuarios').middleware('auth')

Route.group(() => {
  Route.get('/', 'ServicesController.index')
  Route.post('/cadastrar', 'ServicesController.create')
  Route.get('/apagar/:id', 'ServicesController.delete')
}).prefix('servicos').middleware('auth')

Route.group(() => {
  Route.get('/', 'BudgetLayoutsController.index')

  Route.get('/cadastrar', 'BudgetLayoutsController.createForm')
  Route.post('/cadastrar', 'BudgetLayoutsController.create')

  Route.get('/editar/:id', 'BudgetLayoutsController.edit')
  Route.post('/editar', 'BudgetLayoutsController.update')

  Route.get('/apagar/:id', 'BudgetLayoutsController.delete')
}).prefix('modelos').middleware('auth')

Route.group(() => {
  Route.get('/', async ({ view }) => {
    return view.render('rastreamento/painel_rastreamento')
  })
}).prefix('rastreamento').middleware('auth')

Route.group(() => {
  Route.get('/agenda', 'OrdersController.schedule')
  Route.get('/painel/:id', 'OrdersController.panel')

  Route.post('/painel/editar', 'OrdersController.edit')
}).prefix('ordens').middleware('auth')

Route.get('/', async ({ view }) => {
  return view.render('homepage')
}).middleware('auth')

Route.group(() => {
  Route.get('cadastrar', 'ClientsController.createForm')
  Route.post('cadastrar', 'ClientsController.create')

  Route.get('painel/:id', 'ClientsController.dashboard')

  Route.get('painel/:id/informacoes', 'ClientsController.informations')
  Route.get('painel/:id/orcamentos', 'ClientsController.budgets')
  Route.get('painel/:id/ordens', 'ClientsController.orders')
  Route.get('painel/:id/historico', 'ClientsController.historic')

  Route.get('pesquisar', async ({ view }) => {
    return view.render('clientes/pesquisar')
  })
  Route.post('pesquisar', 'ClientsController.search')
}).prefix('clientes').middleware('auth')

Route.group(() => {
  Route.get('cadastrar/:id', 'BudgetsController.register')
  Route.get('editar/:id', 'BudgetsController.edit')
  Route.get('apagar/:id', 'BudgetsController.delete')
  Route.post('cadastrar', 'BudgetsController.create')
}).prefix('orcamentos').middleware('auth')
