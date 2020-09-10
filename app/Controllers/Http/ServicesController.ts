import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Service from 'App/Models/Service'

export default class ServicesController {
  public async index ({ view } : HttpContextContract){
    const services = await Service.all()
    return view.render('servicos/index', {
      services: services,
    })
  }

  public async create ({ request, response, auth } : HttpContextContract){
    const data = request.all()
    if(auth.user){
      try{
        await Service.create({
          user_id: auth.user.id,
          name: data.service_name,
        })
      } catch (err) {
        return response.send(err)
      }
    } else {
      return response.send('Faça Login Antes de Acessar uma Rota')
    }
    return response.redirect('back')
  }

  public async delete ({ params, response } : HttpContextContract){
    const service = await Service.find(params.id)
    await service?.delete()
    return response.redirect('back')
  }
}
