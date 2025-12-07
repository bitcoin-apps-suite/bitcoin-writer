const pushdrop = require('pushdrop')
const KnexStorageEngine = require('./KnexStorageEngine')

/**
 * Note: initial implementation uses basic Javascript class implementation and not abstract classes.
 * TODO: Create an interface using Typescript that describes the requirements of a LookupService,
 * then implement it specifically for KVStore
 * StorageEngine should also use an interface and specifically implement it for KVStore
 */

/**KVStore Protocol fields
0=<pubkey>
1=OP_CHECKSIG
2=protected key
3=value
4=A signature from the field 0 public key over fields 2-3
Above 9=OP_DROP / OP_2DROP — Drop fields 2-4 from the stack.**/


class KVStoreLookupService {
  constructor ({ storageEngine, topics = ['kvstore'] }) {
    this.storageEngine = storageEngine
    this.topics = topics
  }

  /**
   * Notifies the lookup service of a new output added.
   * @param {Object} obj all params are given in an object
   * @param {string} obj.txid the transactionId of the transaction this UTXO is apart of
   * @param {Number} obj.vout index of the output
   * @param {Buffer} obj.outputScript the outputScript data for the given UTXO
   * @returns {string} indicating the success status
   */
  async outputAdded({ txid, vout, outputScript, topic }) {
    if (!this.topics.includes(topic)) return
    // Decode the KVStore fields from the Bitcoin outputScript
    const result = pushdrop.decode({
      script: outputScript.toHex(),
      fieldFormat: 'buffer'
    })

    // KVSTore data to store
    const protectedKey = result.fields[0].toString('base64')

    // Store KVStore fields in the StorageEngine
    await this.storageEngine.storeRecord({
      txid,
      vout,
      protectedKey
    })
  }

  /**
   * Deletes the output record once the UTXO has been spent
   * @param {ob} obj all params given inside an object
   * @param {string} obj.txid the transactionId the transaction the UTXO is apart of
   * @param {Number} obj.vout the index of the given UTXO
   * @param {string} obj.topic the topic this UTXO is apart of
   * @returns
   */
  async outputSpent({ txid, vout, topic }) {
    if (!this.topics.includes(topic)) return
    await this.storageEngine.deleteRecord({ txid, vout })
  }

  /**
   *
   * @param {object} obj all params given in an object
   * @param {object} obj.query lookup query given as an object
   * @returns {object} with the data given in an object
   */
  async lookup({ query }) {
    // Validate Query
    if (!query) {
      const e = new Error('Lookup must include a valid query!')
      e.code = 'ERR_INVALID_QUERY'
      throw e
    }
    if (query.protectedKey) {
      const results = await this.storageEngine.findByProtectedKey({
        protectedKey: query.protectedKey
      })
      for (const i in results) {
        results[i].history = async (output, currentDepth) => { 
          return await this.historySelector(output, currentDepth, query.history)
        }
      }
      // Example depth query:
      // results.history = query.depth
      return results
    } else {
      const e = new Error('Query parameters must include a valid protectedKey!')
      e.code = 'ERR_INSUFFICIENT_QUERY_PARAMS'
      throw e
    }
  }
  async historySelector(output, currentDepth, historyRequested) {
    try {
      if (historyRequested === false && currentDepth > 0) return false
      /**
       * TODO: Add any custom validation code for determining if an output should be included in the history
       * 
       * Example for a Machine Part Tracker Application:
       * if (isMetalPart(result.fields[1].toString())) { // includes history of all metal parts that went into making a machine represented by a UTXO }
       */

      const result = pushdrop.decode({
        script: output.outputScript.toString('hex'),
        fieldFormat: 'buffer'
      })

      if (result.fields.length !== 2) {
        const e = new Error(`KVStore tokens have two PushDrop fields, but this token has ${result.fields.length} fields!`)
        e.code = 'ERR_WRONG_NUMBER_OF_FIELDS'
        throw e
      }

      if (result.fields[0].byteLength !== 32) {
        const e = new Error(`KVStore tokens have 32-byte protected keys in their first PushDrop field, but the key for this token has ${result.fields[0].byteLength} bytes!`)
        e.code = 'ERR_INVALID_KEY_LENGTH'
        throw e
      }

      // Filter Example: only allow data that doesn't start with a number to be selected.
      // if (!/^\d/.test(result.fields[1].toString())) {
      //   return true
      // }
    } catch (error) {
      // Probably not a PushDrop token so do nothing
      console.log(error)
    }
    return true
  }
}
KVStoreLookupService.KnexStorageEngine = KnexStorageEngine
module.exports = KVStoreLookupService