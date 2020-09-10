import User from 'App/Models/User'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
  public async register ({ request, response }: HttpContextContract) {
    const data = request.all()
    try{
      await User.create({
        name: data.name,
        permission: 0,
        email: data.email,
        password: data.password,
      })
    } catch (err){
      return response.send(err)
    }

    return response.redirect('back')
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
}
