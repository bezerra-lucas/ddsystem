import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

}).prefix('clientes')

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
}).prefix('usuarios')

Route.group(() => {
  Route.get('/', async ({ view }) => {
    return view.render('rastreamento/painel_rastreamento')
  })
}).prefix('rastreamento')

Route.group(() => {
  Route.get('/agenda', async ({ view }) => {
    return view.render('ordens/agenda')
  })
}).prefix('ordens')

Route.get('/', async ({ view }) => {
  return view.render('homepage')
}).middleware('auth')

Route.group(() => {
  Route.get('cadastrar', 'ClientsController.createForm')
  Route.post('cadastrar', 'ClientsController.create')
}).prefix('clientes').middleware('auth')
