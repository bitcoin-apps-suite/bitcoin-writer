const makeMigrations = ({ tablePrefix }) => ([{
    up: async knex => {
      await knex.schema.createTable(`${tablePrefix}keys`, table => {
        table.increments('keyID', options={primaryKey: true})
        table.string('txid')
        table.integer('vout')
        table.string('protectedKey')
      })
    },
    down: async knex => {
      await knex.schema.dropTable(`${tablePrefix}keys`)
    }
  }])
  module.exports = makeMigrations
