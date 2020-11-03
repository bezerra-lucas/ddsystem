import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'

import Historic from 'App/Models/Historic'

export default class HistoricsController {
  public async create ({ request, response, auth }: HttpContextContract) {
    const data = request.all()

    await Historic.create({
      date: data.date,
      content: data.content,
      client_id: data.client_id,
      user_id: auth.user?.id,
    })

    return response.redirect('back')
  }
}
