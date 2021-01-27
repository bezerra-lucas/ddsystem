import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Notifications {
  public async handle ({ request }: HttpContextContract, next: () => Promise<void>) {

    const notifications = [
      {
        content: 'Ação agendada para hoje',
        source: 'José da Silva',
        id: 45
      }
    ]

    request.notifications = notifications

    await next()
  }
}
