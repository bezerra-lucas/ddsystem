import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Mail from '@ioc:Adonis/Addons/Mail'

import Client from 'App/Models/Client'
import Database from '@ioc:Adonis/Lucid/Database'
import Budget from 'App/Models/Budget'

export default class BudgetsController {
  public async register ({ view, params } : HttpContextContract){
    function returnError (){
      return view.render('erros/nao_encontrado', {
        errorMessage: 'O cliente requisitado não foi encontrado na base de dados!',
      })
    }
    if(params.id.length < 5){
      const client = await Client.find(params.id)
      const layouts = await Database.rawQuery(`
        SELECT * FROM budget_layouts
      `)

      if(client){
        return view.render('orcamentos/cadastrar', {
          client: client,
          layouts: layouts.rows,
        })
      } else {
        return returnError()
      }
    } else {
      return returnError()
    }
  }

  public async create ({ request, response, view, auth } : HttpContextContract){
    const data = request.all()
    try{
      const client = await Client.find(data.client_id)
      if(client){
        await Budget.create({
          status: 0,
          content: data.budget_content,
          client_id: client.id,
          user_id: auth.user?.id,
          budget_layout_id: data.budget_layout_id,
        })
        return response.redirect('/clientes/painel/' + client.id + '/orcamentos')
      } else {
        return view.render('erros/nao_encontrado', {
          errorMessage: 'O cliente requisitado não foi encontrado na base de dados!',
        })
      }
    } catch(err) {
      return view.render('erros/nao_encontrado', {
        errorMessage: 'Ocorreu um erro: ' + err,
      })
    }
  }

  public async delete ({ params, response, view } : HttpContextContract){
    const budget = await Budget.find(params.id)
    if(budget){
      await budget.delete()
      return response.redirect('back')
    } else {
      return view.render('erros/nao_encontrado', {
        errorMessage: 'O cliente requisitado não foi encontrado na base de dados!',
      })
    }
  }

  public async edit ({ view, params } : HttpContextContract){
    const budget = await Budget.find(params.id)
    return view.render('orcamentos/editar', {
      budget: budget,
    })
  }

  public async send ({ response } : HttpContextContract){
    await Mail.send((message) => {
      message
        .from('osakadedetizadora2020@gmail.com')
        .to('1lcs.bzrr@gmail.com')
        .subject('Welcome Onboard!')
        .htmlView('emails/welcome', {
          user: { fullName: 'Some Name' },
          url: 'https://your-app.com/verification-url',
        })
    })
    return response.send('ok')
  }
}
