import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import BudgetLayout from 'App/Models/BudgetLayout'

export default class BudgetLayoutsController {
  public async index ({ view } : HttpContextContract){
    const layouts = await BudgetLayout.all()
    return view.render('modelos/index', {
      layouts: layouts,
    })
  }

  public async createForm ({ view } : HttpContextContract){
    return view.render('modelos/cadastrar')
  }
}
