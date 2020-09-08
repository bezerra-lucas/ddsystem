import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Service from 'App/Models/Service'
import Client from 'App/Models/Client'
import Order from 'App/Models/Order'

export default class ClientController {
  public async createForm ({ view }:HttpContextContract){
    const services = await Service.all()
    return view.render('clientes/cadastrar', {
      services: services,
    })
  }

  public async create ({ request, response, auth }:HttpContextContract){
    const data = request.all()

    try{
      const client = await Client.create({
        name: data.client_name,
        cpf: data.client_cpf,
        cnpj: data.client_cnpj,
        user_id: auth.user?.id,
      })

      await Order.create({
        type: 0,
        date: data.visit_date.replace(/\D/g, ''),
        time: data.visit_time.replace(/\D/g, ''),
        service_id: data.visit_service,
        client_id: client.id,
        user_id: auth.user?.id,
      })
    } catch (err) {
      return response.send(err)
    }

    return response.redirect('back')
  }
}
