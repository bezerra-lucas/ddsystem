import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { DateTime } from 'luxon'

import Order from 'App/Models/Order'
import Client from 'App/Models/Client'
import Service from 'App/Models/Service'

import Database from '@ioc:Adonis/Lucid/Database'

function onlyAlpha (string){
  if(string){
    return string.replace(/\D/g, '')
  } else {
    return ''
  }
}

export default class OrdersController {
  public async create ({ response, request, auth } : HttpContextContract){
    const data = request.all()

    const client = await Client.find(data.client_id)

    const date = onlyAlpha(data.order_date)
    const time = onlyAlpha(data.order_time)
    const day = date.charAt(6) + date.charAt(7)
    const month = date.charAt(4) + date.charAt(5)
    const year = date.charAt(0) + date.charAt(1) + date.charAt(2) + date.charAt(3)
    const hour = time.charAt(0) + time.charAt(1)
    const minute = time.charAt(2) + time.charAt(3)

    const dateTime = DateTime.fromISO(`${year}-${month}-${day}T${hour}:${minute}:00`, { setZone: true })

    await Order.create({
      type: data.order_type,
      dateTime: dateTime,
      service_id: data.service_id,
      client_id: client?.id,
      user_id: auth.user?.id,
    })

    return response.redirect('/clientes/painel/' + client?.id + '/ordens')
  }

  public async register ({ view, params } : HttpContextContract){
    const client = await Client.find(params.id)
    const services = await Service.all()

    return view.render('ordens/cadastrar', {
      client: client,
      services: services,
    })
  }

  public async schedule ({ view } : HttpContextContract){
    const orders = await Database.rawQuery(`
      SELECT clients.name as title, clients.id as client_id, orders.date_time, orders.type, orders.id
      FROM orders
      INNER JOIN clients
      ON orders.client_id = clients.id
    `)

    const green = '#2e7d32'
    const blue = '#0288d1'
    const orange = '#ef6c00'

    orders.rows.map(
      function (order){
        order.start = order.date_time

        switch(order.type){
          case 0: order.backgroundColor = blue; break
          case 1: order.backgroundColor = green; break
          case 2: order.backgroundColor = orange; break
        }
      }
    )

    return view.render('ordens/agenda', {
      orders: JSON.stringify(orders.rows),
    })
  }

  public async edit ({ view, params } : HttpContextContract){
    const id = params.id
    const order = await Order.find(id)
    const services = await Service.all()

    if(order){
      const client = await Client.find(order.client_id)
      const dateTimeArray = JSON.stringify(order.dateTime).split('T')
      console.log(dateTimeArray)
      const date = dateTimeArray[0].slice(1, 11)
      const time = dateTimeArray[1].slice(0, 8)
      console.log('date: ' + date + '\n' + 'time: ' + time)

      return view.render('ordens/editar', {
        order: order,
        client: client,
        date: date,
        time: time,
        services: services,
      })
    } else {
      return view.render('erros/nao_encontrado', {
        errorMessage: 'A ordem requisitada não foi encontrada na base de dados!',
      })
    }
  }

  public async update ({ request, response, view } : HttpContextContract){
    const data = request.all()
    const order = await Order.find(data.order_id)
    if(order){
      order.content = data.order_content

      order.dateTime = data.order_date + 'T' + data.order_time

      await order.save()
      return response.redirect(`/clientes/painel/${order.client_id}/ordens`)
    } else {
      return view.render('erros/nao_encontrado', {
        errorMessage: 'A ordem requisitada não foi encontrada na base de dados!',
      })
    }
  }
}
