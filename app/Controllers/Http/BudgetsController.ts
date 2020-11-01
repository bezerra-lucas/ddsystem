import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Mail from '@ioc:Adonis/Addons/Mail'
import Application from '@ioc:Adonis/Core/Application'

import Client from 'App/Models/Client'
import Database from '@ioc:Adonis/Lucid/Database'
import Budget from 'App/Models/Budget'

var fs = require('fs')
var pdf = require('html-pdf')

function generateRandomString (){
  var random = Math.random() * (9999999999999 - 0)
  return (random.toString().replace(/\D/g, ''))
}

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

  public async sendOptions ({ response, params, view } : HttpContextContract){
    const budget = await Budget.find(params.id)
  }

  public async send ({ response, params, view } : HttpContextContract){
    const budget = await Budget.find(params.id)

    if(budget){
      var filename = generateRandomString()
      var fileExists = true

      while(fileExists === true) {
        if (fs.existsSync(`./temp/${filename}.pdf`)) {
          filename = generateRandomString()
        } else {
          var fileExists = false
        }
      }

      const path = `./temp/${filename}.pdf`

      pdf.create(budget.content, {

        format: 'Letter',
        orientation: 'portrait',

        'border': {
          'right': '0.75in',
          'left': '0.75in',

          'bottom': '1in',
          'top': '1in',
        },

      }).toFile(path, async (err, res) => {
        if (err) {
          return console.log(err)
        }
        await Mail.send((message) => {
          message
            .from('1lcs.bzrr@gmail.com')
            .to('1lcs.bzrr@gmail.com')
            .subject('Orçamento - Osaka Dedetizadora')
            .htmlView('emails/orcamento', {
              budget_content: budget.content,
            })
            .attach(res.filename, {
              filename: filename + '.pdf',
            })
        })
      })

      response.redirect('back')
    } else {
      return view.render('erros/nao_encontrado', {
        errorMessage: 'O orçamento requisitado não foi encontrado na base de dados!',
      })
    }
  }
}
