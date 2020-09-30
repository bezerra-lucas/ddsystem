import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Service from 'App/Models/Service'
import Client from 'App/Models/Client'
import Order from 'App/Models/Order'
import Address from 'App/Models/Address'
import Contact from 'App/Models/Contact'

import Database from '@ioc:Adonis/Lucid/Database'

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
        cpf: data.client_cpf.replace(/\D/g, ''),
        cnpj: data.client_cnpj,
        user_id: auth.user?.id,
      })

      await Order.create({
        type: 0,
        date: data.order_date.replace(/\D/g, ''),
        time: data.order_time.replace(/\D/g, ''),
        service_id: data.order_service,
        client_id: client.id,
        user_id: auth.user?.id,
      })

      var i = 0
      var ii = 0

      while(i <= data.address_count){
        await Address.create({
          name: request.input('address_name' + i),
          street: request.input('address_street' + i),
          number: request.input('address_number' + i),
          cep: request.input('address_cep' + i).replace(/\D/g, ''),
          client_id: client.id,
          user_id: auth.user?.id,
        })
        i++
      }

      while(ii <= data.contact_count){
        await Contact.create({
          name: request.input('contact_name' + ii),
          email: request.input('contact_email' + ii),
          phone: request.input('contact_phone' + ii).replace(/\D/g, ''),
          responsible: request.input('contact_responsible' + ii),
          client_id: client.id,
          user_id: auth.user?.id,
        })
        ii++
      }
    } catch (err) {
      return response.send(err)
    }
  }

  public async dashboard ({ view, response, params }: HttpContextContract){
    const client = await Client.find(params.id)
    if(client){
      return response.redirect(`/clientes/painel/${client.id}/informacoes`)
    } else {
      return view.render('erros/nao_encontrado', {
        errorMessage: 'O cliente requisitado não foi encontrado na base de dados!',
      })
    }
  }

  public async informations ({ view, params }: HttpContextContract){
    const client = await Client.find(params.id)
    return view.render('clientes/informacoes', {
      client: client,
    })
  }

  public async budgets ({ view, params }: HttpContextContract){
    const client = await Client.find(params.id)
    return view.render('clientes/orcamentos', {
      client: client,
    })
  }

  public async orders ({ view, params }: HttpContextContract){
    const client = await Client.find(params.id)
    return view.render('clientes/ordens', {
      client: client,
    })
  }

  public async historic ({ view, params }: HttpContextContract){
    const client = await Client.find(params.id)
    return view.render('clientes/historico', {
      client: client,
    })
  }

  public async search ({ request, view }:HttpContextContract){
    var results : Array<[]> | null = []
    var client : null | Client | undefined
    var message : String | undefined

    if(request.input('search_column') === 'id') {
      client = await Client.find(request.input('search_term'))
    } else {
      results = await Database
        .from('clients')
        .select('*')
        .where(request.input('search_column'), 'LIKE', '%'+request.input('search_term')+'%')
    }

    if(results === null || !results || results === []){
      message = 'Não foi encontrado nenhum resultado para esta pesquisa.'
    }

    return view.render('clientes/pesquisar', {
      results: results,
      client: client,
      message: message,
    })
  }
}
