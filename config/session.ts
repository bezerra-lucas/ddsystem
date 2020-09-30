import Env from '@ioc:Adonis/Core/Env'
import { SessionConfig } from '@ioc:Adonis/Addons/Session'

const sessionConfig: SessionConfig = {
  driver: Env.get('SESSION_DRIVER', 'cookie') as string,
  cookieName: 'adonis-session',
  clearWithBrowser: false,
  age: '7 days',
  cookie: {
    path: '/',
    httpOnly: true,
    sameSite: false,
  },
  file: {
    location: '',
  },
  redisConnection: 'session',
}

export default sessionConfig
