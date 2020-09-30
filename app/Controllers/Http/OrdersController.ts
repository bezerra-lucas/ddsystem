import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Order from 'App/Models/Order'
import Client from 'App/Models/Client'

import Database from '@ioc:Adonis/Lucid/Database'

export default class OrdersController {
  public async schedule ({ view } : HttpContextContract){
    const orders = await Database.rawQuery(`
      SELECT clients.name as title, clients.id, orders.date, orders.time, orders.type
      FROM orders
      INNER JOIN clients
      ON orders.client_id = clients.id
    `)

    const green = '#2e7d32'
    const blue = '#0288d1'
    const orange = '#ef6c00'

    orders.rows.map(
      function (order){
        order.start = `${order.date}T${order.time}`

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

  public async panel ({ view, params } : HttpContextContract){
    const id = params.id
    const order = await Order.find(id)
    if(order){
      const client = await Client.find(order.client_id)
      return view.render('ordens/painel', {
        order: order,
        client: client,
      })
    } else {
      return view.render('erros/nao_encontrado', {
        errorMessage: 'A ordem requisitada não foi encontrada na base de dados!',
      })
    }
  }
}
