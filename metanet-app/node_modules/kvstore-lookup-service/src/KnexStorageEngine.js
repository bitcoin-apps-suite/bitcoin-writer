const makeMigrations = require('./makeMigrations')

/**
 * StorageEngine specifically implemented for KVStore Lookup with Knex
 * TODO: Use Typescript interface to extend functionality of base class
 * Generic lookservice should return the topic as well as the txid and vout
 */
class KnexStorageEngine {
  constructor ({ knex, tablePrefix = 'kvstore_lookup_' }) {
    this.knex = knex
    this.tablePrefix = tablePrefix
    this.migrations = makeMigrations({ tablePrefix })
  }

  /**
   * Stores a new TSP record
   * @param {object} obj all params given in an object
   * @param {string} obj.txid the transactionId of the transaction this UTXO is apart of
   * @param {Number} obj.vout index of the output
   * @param {String} obj.protectedKey KVStore key
   */
  async storeRecord ({ 
    txid, 
    vout, 
    protectedKey
  }) {
    await this.knex(`${this.tablePrefix}keys`).insert({
      txid,
      vout,
      protectedKey
    })
  }

  /**
   * Deletes an existing kvstore record
   * @param {Object} obj all params given in an object
   */
  async deleteRecord ({ txid, vout }) {
    await this.knex(`${this.tablePrefix}keys`).where({
      txid,
      vout
    }).del()
  }

  /**
   * Look up a kvstore record by the protectedKey
   * @param {Object} obj params given in an object
   * @param {String} obj.protectedKey artist's identity key(s)
   */
  async findByProtectedKey ({ protectedKey }) {
    return await this.knex(`${this.tablePrefix}keys`).where({
      protectedKey
    }).select('txid', 'vout')
  }
}

module.exports = KnexStorageEngine