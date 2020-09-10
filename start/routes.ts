import Route from '@ioc:Adonis/Core/Route'

Route.get('/logout', 'AuthController.logout')

Route.group(() => {
  Route.get('/', async ({ view }) => {
    return view.render('login')
  })
  Route.post('/', 'AuthController.login')
}).prefix('login')

Route.group(() => {
  Route.get('/', async ({ view }) => {
    return view.render('usuarios/cadastrar')
  })
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
}).prefix('modelos').middleware('auth')

Route.group(() => {
  Route.get('/', async ({ view }) => {
    return view.render('rastreamento/painel_rastreamento')
  })
}).prefix('rastreamento').middleware('auth')

Route.group(() => {
  Route.get('/agenda', async ({ view }) => {
    return view.render('ordens/agenda')
  })
}).prefix('ordens').middleware('auth')

Route.get('/', async ({ view }) => {
  return view.render('homepage')
}).middleware('auth')

Route.group(() => {
  Route.get('cadastrar', 'ClientsController.createForm')
  Route.post('cadastrar', 'ClientsController.create')
}).prefix('clientes').middleware('auth')
