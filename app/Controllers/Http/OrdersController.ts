import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { DateTime } from 'luxon'

import Order from 'App/Models/Order'
import Client from 'App/Models/Client'

import Database from '@ioc:Adonis/Lucid/Database'

function onlyAlpha (string){
  if(string){
    return string.replace(/\D/g, '')
  } else {
    return ''
  }
}

export default class OrdersController {
  public async register ({ view, params } : HttpContextContract){
    const client = await Client.find(params.id)
    return view.render('ordens/cadastrar', {
      client: client,
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
    if(order){
      const client = await Client.find(order.client_id)
      const date = order.dateTime.year + order.dateTime.month + order.dateTime.day
      const time = order.dateTime.hour + order.dateTime.minute
      return view.render('ordens/editar', {
        order: order,
        client: client,
        date: date,
        time: time,
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
<<<<<<< HEAD
      order.type = onlyAlpha(data.order_type)
      // order.time = onlyAlpha(data.order_time)
      // order.date = onlyAlpha(data.order_date)
=======
      const date = onlyAlpha(data.order_date)
      const time = onlyAlpha(data.order_time)
      const day = date.charAt(6) + date.charAt(7)
      const month = date.charAt(4) + date.charAt(5)
      const year = date.charAt(0) + date.charAt(1) + date.charAt(2) + date.charAt(3)
      const hour = time.charAt(0) + time.charAt(1)
      const minute = time.charAt(2) + time.charAt(3)

      order.dateTime = DateTime.fromISO(`${year}-${month}-${day}T${hour}:${minute}:00`, { setZone: true })
>>>>>>> f878002eb369463b11c59c219bff491592428965
      await order.save()
      return response.redirect(`/clientes/painel/${order.client_id}/ordens`)
    } else {
      return view.render('erros/nao_encontrado', {
        errorMessage: 'A ordem requisitada não foi encontrada na base de dados!',
      })
    }
  }
}
