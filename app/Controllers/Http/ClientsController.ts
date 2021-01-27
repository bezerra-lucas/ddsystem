import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { DateTime } from 'luxon'

import Service from 'App/Models/Service'
import Client from 'App/Models/Client'
import Order from 'App/Models/Order'
import Address from 'App/Models/Address'
import Contact from 'App/Models/Contact'
import Budget from 'App/Models/Budget'
import Historic from 'App/Models/Historic'

import Database from '@ioc:Adonis/Lucid/Database'
// import { formatIsoTimeString } from '@fullcalendar/core'

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
        type: schema.string(),
        name: schema.string(),
        cpf: schema.string.optional(),
        cnpj: schema.string.optional(),
        date: schema.string(),
        time: schema.string(),
        service: schema.number(),
        address_count: schema.number(),
        contact_count: schema.number(),
      }),
      messages: {
        required: 'Por favor preencha este campo',
      },
    })

    var client : Client

    if(validated.type === '0'){
      client = await Client.create({
        is_pf: true,
        name: validated.name,
        cpf: onlyAlpha(validated.cpf),
        user_id: auth.user?.id,
      })
    } else {
      client = await Client.create({
        is_pf: false,
        name: validated.name,
        cnpj: onlyAlpha(validated.cnpj),
        user_id: auth.user?.id,
      })
    }

    const date = onlyAlpha(validated.date)
    const time = onlyAlpha(validated.time)
    const day = date.charAt(6) + date.charAt(7)
    const month = date.charAt(4) + date.charAt(5)
    const year = date.charAt(0) + date.charAt(1) + date.charAt(2) + date.charAt(3)
    const hour = time.charAt(0) + time.charAt(1)
    const minute = time.charAt(2) + time.charAt(3)

    const dateTime = DateTime.fromISO(`${year}-${month}-${day}T${hour}:${minute}:00`, { setZone: true })

    const order = await Order.create({
      type: 0,
      dateTime: dateTime,
      service_id: validated.service,
      client_id: client.id,
      user_id: auth.user?.id,
    })

    const budget = await Budget.create({
      status: 0,
      content: '  ',
      order_id: order.id,
      client_id: client.id,
      user_id: auth.user?.id,
    })

    order.budget_id = budget.id
    await order.save()

    var currentAddresses = 0
    var currentContacts = 0

    while(currentContacts <= validated.contact_count - 1){
      await Contact.create({
        email: request.input('contact_email' + currentContacts),
        phone: request.input('contact_phone' + currentContacts).replace(/\D/g, ''),
        responsible: request.input('contact_responsible' + currentContacts),
        client_id: client.id,
        user_id: auth.user?.id,
      })
      currentContacts++
    }

    while(currentAddresses <= validated.address_count - 1){
      await Address.create({
        street: request.input('address_street' + currentAddresses),
        number: request.input('address_number' + currentAddresses),
        cep: request.input('address_cep' + currentAddresses).replace(/\D/g, ''),
        client_id: client.id,
        user_id: auth.user?.id,
      })
      currentAddresses++
    }

    var today : Date | string = new Date()
    var dd = String(today.getDate()).padStart(2, '0')
    var mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
    var yyyy = today.getFullYear()

    today = yyyy + '-' + mm + '-' + dd

    await Historic.create({
      date: onlyAlpha(today),
      content: 'Cliente Cadastrado',
      client_id: client.id,
      user_id: auth.user?.id,
    })

    return response.redirect('/')
  }

  public async update ({ request, response, view }: HttpContextContract){
    const data = request.all()
    const client = await Client.find(data.client_id)
    if(client){

      if(data.client_is_pf === '0'){
        client.is_pf = false
      } else {
        client.is_pf = true
      }

      client.name = data.client_name
      client.cpf = onlyAlpha(data.client_cpf)
      client.cnpj = onlyAlpha(data.client_cnpj)

      await client.save()
    }
    if(client){
      return response.redirect(`/clientes/painel/${client.id}/informacoes`)
    } else {
      return view.render('erros/nao_encontrado', {
        errorMessage: 'O cliente requisitado não foi encontrado na base de dados!',
      })
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
    const addresses = await Database.rawQuery(`
      SELECT *
      FROM addresses
      WHERE client_id = ${client?.id}
    `)

    const contacts = await Database.rawQuery(`
      SELECT *
      FROM contacts
      WHERE client_id = ${client?.id}
    `)

    return view.render('clientes/informacoes', {
      client: client,
      addresses: addresses.rows,
      contacts: contacts.rows,
      string_addresses: JSON.stringify(addresses.rows),
      string_contacts: JSON.stringify(contacts.rows),
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

  public async edit ({ view, params }: HttpContextContract){
    const client = await Client.find(params.id)
    const addresses = await Database.rawQuery(`
      SELECT *
      FROM addresses
      WHERE client_id = ${client?.id}
    `)

    const contacts = await Database.rawQuery(`
      SELECT *
      FROM contacts
      WHERE client_id = ${client?.id}
    `)

    return view.render('clientes/editar', {
      client: client,
      addresses: addresses.rows,
      contacts: contacts.rows,
    })
  }

  public async orders ({ view, params }: HttpContextContract){
    const client = await Client.find(params.id)
    const orders = await Database.rawQuery(`
      SELECT orders.*, users.name
      FROM orders
      INNER JOIN users
        ON orders.user_id = users.id
      WHERE orders.client_id = ${client?.id}
    `)

    orders.rows.map(
      function (order){
        order.dateTime = order.dateTime
      }
    )

    const contacts = await Database.rawQuery(`
      SELECT *
      FROM contacts
      WHERE client_id = ${client?.id}
    `)

    return view.render('clientes/ordens', {
      client: client,
      orders: orders.rows,
      contacts: contacts.rows,
    })
  }

  public async historic ({ view, params }: HttpContextContract){
    const client = await Client.find(params.id)
    const historics = await Database.rawQuery(`
      SELECT historics.content, historics.date, users.id, users.name
      FROM historics
        INNER JOIN users
        ON historics.user_id = users.id
      WHERE client_id = ${client?.id}
    `)

    historics.rows.map(
      function (historic){
        historic.date =
        historic.date.charAt(6) +
        historic.date.charAt(7) +
        '/' +
        historic.date.charAt(4) +
        historic.date.charAt(5) +
        '/' +
        historic.date.charAt(0) +
        historic.date.charAt(1) +
        historic.date.charAt(2) +
        historic.date.charAt(3)
      }
    )

    return view.render('clientes/historico', {
      client: client,
      historics: historics.rows,
    })
  }

  public async search ({ request, view, response }:HttpContextContract){
    var results : Array<[]> | null = []
    var client : null | Client | undefined

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
      })
    }
  }
}
