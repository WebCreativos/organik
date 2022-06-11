module.exports = ({
  env
}) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'bookshelf',
      settings: {
        client: 'mysql',
        host: 'mysql',
        port: 3306,
        database: 'organik',
        username: 'organik_user',
        password: '983f07553',
      }, 
      options: {}
    },
  }
})