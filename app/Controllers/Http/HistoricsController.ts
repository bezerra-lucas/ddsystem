import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Historic from 'App/Models/Historic'

function onlyAlpha (string){
  if(string){
    return string.replace(/\D/g, '')
  } else {
    return ''
  }
}

export default class HistoricsController {
  public async create ({ request, response, auth }: HttpContextContract) {
    const data = request.all()

    await Historic.create({
      date: onlyAlpha(data.date),
      content: data.content,
      client_id: data.client_id,
      user_id: auth.user?.id,
    })

    return response.redirect('back')
  }
}
