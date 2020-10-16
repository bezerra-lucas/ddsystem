import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import BudgetLayout from 'App/Models/BudgetLayout'
import Budget from 'App/Models/Budget'

export default class BudgetLayoutsController {
  public async index ({ view } : HttpContextContract){
    const layouts = await BudgetLayout.all()
    return view.render('modelos/index', {
      layouts: layouts,
    })
  }

  public async create ({ request, response, auth } : HttpContextContract){
    const budgetSchema = schema.create({
      layout_name: schema.string({}, [
        rules.required(),
      ]),
      layout_content: schema.string({}, [
        rules.required(),
      ]),
    })

    const validated = await request.validate({
      schema: budgetSchema,
    })

    try{
      await BudgetLayout.create({
        name: validated.layout_name,
        content: validated.layout_content,
        user_id: auth.user?.id,
      })
    } catch (err){
      return response.send(err)
    }

    return response.redirect('/modelos')
  }

  public async createForm ({ view } : HttpContextContract){
    return view.render('modelos/cadastrar')
  }

  public async delete ({ params, response, view } : HttpContextContract){
    const id = params.id
    const layout = await BudgetLayout.find(id)
    if (layout) {
      await layout.delete()
      return response.redirect('back')
    } else {
      return view.render('erros/nao_encontrado', {
        errorMessage: 'O modelo requisitado não foi encontrado na base de dados!',
      })
    }
  }

  public async edit ({ view, params } : HttpContextContract){
    const layout = await BudgetLayout.find(params.id)
    return view.render('modelos/editar', {
      layout: layout,
    })
  }

  public async update ({ request, response, view } : HttpContextContract){
    const budgetSchema = schema.create({
      layout_name: schema.string({}, [
        rules.required(),
      ]),
      layout_content: schema.string({}, [
        rules.required(),
      ]),
      layout_id: schema.string({}, [
        rules.required(),
      ]),
    })

    const validated = await request.validate({
      schema: budgetSchema,
    })

    const layout = await BudgetLayout.find(validated.layout_id)

    if(layout){
      layout.name = validated.layout_name
      layout.content = validated.layout_content
      await layout?.save()
      return response.redirect('/modelos')
    } else {
      return view.render('erros/nao_encontrado', {
        errorMessage: 'O modelo requisitado não foi encontrado na base de dados!',
        backButtonLink: '/modelos',
      })
    }
  }
}
