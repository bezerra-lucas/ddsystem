import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Service from 'App/Models/Service'
import Client from 'App/Models/Client'
import Order from 'App/Models/Order'
import Address from 'App/Models/Address'
import Contact from 'App/Models/Contact'

import Database from '@ioc:Adonis/Lucid/Database'

function onlyAlpha (string){
  if(string){
    return string.replace(/\D/g, '')
  } else {
    return ''
  }
}

export default class ClientController {
  public async createForm ({ view }:HttpContextContract){
    const services = await Service.all()
    return view.render('clientes/cadastrar', {
      services: services,
    })
  }

  public async create ({ request, response, auth }:HttpContextContract){
    const validated = await request.validate({
      schema: schema.create({
        client: schema.object().members({
          type: schema.string(),
          name: schema.string(),
          cpf: schema.string.optional(),
          cnpj: schema.string.optional(),
        }),
        order: schema.object().members({
          date: schema.string(),
          time: schema.string(),
          service: schema.number(),
        }),
        address_count: schema.number(),
        contact_count: schema.number(),
      }),
      messages: {
        'test': '',
      },
    })

    try{
      var client : Client

      if(validated.client.type === '0'){
        client = await Client.create({
          name: validated.client.name,
          cpf: onlyAlpha(validated.client.cpf),
          user_id: auth.user?.id,
        })
      } else {
        client = await Client.create({
          name: validated.client.name,
          cnpj: onlyAlpha(validated.client.cnpj),
          user_id: auth.user?.id,
        })
      }

      await Order.create({
        type: 0,
        date: validated.order.date.replace(/\D/g, ''),
        time: validated.order.time.replace(/\D/g, ''),
        service_id: validated.order.service,
        client_id: client.id,
        user_id: auth.user?.id,
      })

      var i = 0
      var ii = 0

      while(i <= validated.address_count){
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

      while(ii <= validated.contact_count){
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

    const budgets = await Database.rawQuery(`
      SELECT budgets.id, budgets.status, budgets.created_at, budgets.budget_layout_id, users.id as user_id, users.name as user_name, budget_layouts.name as budget_layouts_name
      FROM budgets
      INNER JOIN users
      ON budgets.user_id = users.id
      INNER JOIN budget_layouts
      ON budget_layout_id = budget_layouts.id
    `)

    return view.render('clientes/orcamentos', {
      client: client,
      budgets: budgets,
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

  public async search ({ request, view, response }:HttpContextContract){
    var results : Array<[]> | null = []
    var client : null | Client | undefined
    var message : String | undefined

    if(request.input('search_column') === 'id') {
      client = await Client.find(request.input('search_term'))
      if(client){
        return response.redirect('/clientes/painel/' + client.id)
      } else {
        return view.render('erros/nao_encontrado', {
          errorMessage: 'Não foi encontrado nenhum resultado para esta pesquisa.',
          backButtonLink: '/clientes/pesquisar',
        })
      }
    } else {
      results = await Database
        .from('clients')
        .select('*')
        .where(request.input('search_column'), 'LIKE', '%'+request.input('search_term')+'%')

      return view.render('clientes/pesquisar', {
        results: results,
        client: client,
        message: message,
      })
    }
  }
}
