module.exports = {
  client: 'mssql',
  connection: {
    host: 'servidor01191045.database.windows.net',
    user: 'GF01191045',
    password: '#Gf46768871838',
    database: 'RaiseAdventurer',
    encrypt: true
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }
};