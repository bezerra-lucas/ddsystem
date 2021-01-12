declare module '@ioc:Adonis/Core/Request' {
  interface RequestContract {
    notifications?: Array<Object | string> | string
  }
}
