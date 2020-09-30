import user from 'App/Models/User'
import { AuthConfig } from '@ioc:Adonis/Addons/Auth'
const authConfig: AuthConfig = {
  guard: 'web',
  list: {
    web: {
      driver: 'session',
      provider: {
        driver: 'lucid',
        identifierKey: 'id',
        uids: ['email'],
        model: user,
      },
    },
  },
}

export default authConfig
