import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'
import Role from 'App/Models/Role'

import Database from '@ioc:Adonis/Lucid/Database'

export default class AuthController {
  public async index ({ view }){
    const users = await Database.rawQuery(`
      SELECT users.name, users.email, users.id, users.role_id, roles.name as roles_name
      FROM users
      INNER JOIN roles
      ON users.role_id = roles.id
    `)

    return view.render('usuarios/index', {
      users: users,
    })
  }

  public async register ({ request, response }: HttpContextContract) {
    const data = request.all()
    try{
      await User.create({
        name: data.name,
        email: data.email,
        password: data.password,
        role_id: data.role_id,
      })
    } catch (err){
      return response.send(err)
    }

    return response.redirect('/usuarios')
  }

  public async login ({ auth, request, response }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')
    await auth.attempt(email, password)

    response.redirect('/')
  }

  public async logout ({ auth, response } : HttpContextContract){
    await auth.logout()
    return response.redirect('/login')
  }

  public async delete ({ params, response, view } : HttpContextContract){
    const user = await User.find(params.id)
    if(user){
      await user.delete()
      return response.redirect('back')
    } else {
      return view.render('erros/nao_encontrado', {
        errorMessage: 'Usuário não encontrado.',
        backButtonLink: '/usuarios',
      })
    }
  }

  public async edit ({ params, view } : HttpContextContract){
    const user = await User.find(params.id)
    return view.render('usuarios/editar', {
      user: user,
    })
  }

  public async create ({ view } : HttpContextContract){
    const roles = await Role.all()
    return view.render('usuarios/cadastrar', {
      roles: roles,
    })
  }

  public async config ({ view } : HttpContextContract){
    return view.render('usuarios/configuracoes')
  }
}
