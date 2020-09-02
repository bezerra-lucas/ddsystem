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
    return view.render('cadastrar')
  })
  Route.post('/', 'AuthController.register')
}).prefix('cadastrar')

Route.get('/', async ({ view }) => {
  return view.render('css_demonstration')
}).middleware('auth')
