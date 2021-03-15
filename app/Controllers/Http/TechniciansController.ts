import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Technician from 'App/Models/Technician'

export default class TechniciansController {
  public async index ({ view } : HttpContextContract){
    const technicians = await Technician.all()
    return view.render('tecnicos/index', {
      technicians: technicians,
    })
  }

  public async create ({ request, response } : HttpContextContract){
    const data = request.all()
    await Technician.create({
      name: data.name,
      phone: data.phone,
      email: data.email,
    })
    return response.redirect('/tecnicos')
  }

  public async delete ({ params, response } : HttpContextContract){
    const technician = await Technician.find(params.id)
    await technician?.delete()
    return response.redirect('back')
  }
}
