import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Role from 'App/Models/Role'
import { ViewRoot } from 'public/fullcalendar/common/main'

export default class RolesController {
  public async index ({ view }:HttpContextContract){
    const roles = await Role.all()
    return view.render('usuarios/cargos/index', {
      roles: roles,
    })
  }

  public async register ({ view }:HttpContextContract){
    return view.render('usuarios/cargos/cadastrar')
  }

  public async create ({ request, response }:HttpContextContract){
    const data = request.all()

    function checkValue (input){
      if(request.input(input) === '1'){
        return true
      } else {
        return false
      }
    }

    await Role.create({
      name: data.role_name,
      has_permission_to_create_clients: checkValue('has_permission_to_create_clients'),
      has_permission_to_see_client_panel: checkValue('has_permission_to_see_client_panel'),
      has_permission_to_manage_budgets: checkValue('has_permission_to_manage_budgets'),
      has_permission_to_manage_budget_layouts: checkValue('has_permission_to_manage_budget_layouts'),
      has_permission_to_manage_orders: checkValue('has_permission_to_manage_orders'),
      has_permission_to_manage_historic: checkValue('has_permission_to_manage_historic'),
      has_permission_to_access_gps_tracker: checkValue('has_permission_to_access_gps_tracker'),
      has_permission_to_manage_services: checkValue('has_permission_to_manage_services'),
      has_permission_to_manage_users: checkValue('has_permission_to_manage_users'),
    })

    return response.redirect('/usuarios/cargos')
  }

  public async update ({ request, response, view }:HttpContextContract){
    const data = request.all()
    const role = await Role.find(data.role_id)

    function checkValue (input){
      if(request.input(input) === '1'){
        return true
      } else {
        return false
      }
    }

    if(role){
      role.name = data.role_name,
      role.has_permission_to_create_clients = checkValue('has_permission_to_create_clients'),
      role.has_permission_to_see_client_panel = checkValue('has_permission_to_see_client_panel'),
      role.has_permission_to_manage_budgets = checkValue('has_permission_to_manage_budgets'),
      role. has_permission_to_manage_budget_layouts = checkValue('has_permission_to_manage_budget_layouts'),
      role.has_permission_to_manage_orders = checkValue('has_permission_to_manage_orders'),
      role. has_permission_to_manage_historic = checkValue('has_permission_to_manage_historic'),
      role.has_permission_to_access_gps_tracker = checkValue('has_permission_to_access_gps_tracker'),
      role. has_permission_to_manage_services = checkValue('has_permission_to_manage_services'),
      role. has_permission_to_manage_users = checkValue('has_permission_to_manage_users'),
      await role.save()
      return response.redirect('/usuarios/cargos')
    } else {
      return view.render('erros/nao_encontrado', {
        errorMessage: 'ID de Cargo não encontrado',
      })
    }
  }

  public async edit ({ view, params }:HttpContextContract){
    const role = await Role.find(params.id)
    return view.render('usuarios/cargos/editar', {
      role: role,
    })
  }

  public async delete ({ response, params, view }:HttpContextContract){
    const role = await Role.find(params.id)
    if(role){
      await role.delete()
    } else {
      return view.render('erros/nao_encontrado', {
        errorMessage: 'ID de Cargo não encontrado',
      })
    }
    return response.redirect('/usuarios/cargos')
  }
}
