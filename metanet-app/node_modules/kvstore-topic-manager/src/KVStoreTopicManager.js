const bsv = require('babbage-bsv')
const pushdrop = require('pushdrop')

/**KVStore Protocol fields
0=<pubkey>
1=OP_CHECKSIG
2=protected key
3=value
4=A signature from the field 0 public key over fields 2-3
Above 4=OP_DROP / OP_2DROP — Drop fields 2-4 from the stack.**/

class KVStoreTopicManager {
  /**
   * Returns the outputs from the transaction that are admissible.
   * @param {Object} obj all params given in an object
   * @param {Object} obj.parsedTransaction transaction containing outputs to admit into the current topic
   * @returns
   */

  identifyAdmissibleOutputs ({ previousUTXOs, parsedTransaction }) {
    try {
      const outputsToAdmit = []
      
      // Validate params
      if (!Array.isArray(parsedTransaction.inputs) || parsedTransaction.inputs.length < 1) {
        const e = new Error('An array of transaction inputs is required!')
        e.code = 'ERR_TX_INPUTS_REQUIRED'
        throw e
      }
      if (!Array.isArray(parsedTransaction.outputs) || parsedTransaction.outputs.length < 1) {
        const e = new Error('Transaction outputs must be included as an array!')
        e.code = 'ERR_TX_OUTPUTS_REQUIRED'
        throw e
      }

      // Try to decode and validate transaction outputs
      for (const [i, output] of parsedTransaction.outputs.entries()) {
        // Decode the TSP account fields
        try {
          const result = pushdrop.decode({
            script: output.script.toHex(),
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

          outputsToAdmit.push(i)
        } catch (error) {
          // Probably not a PushDrop token so do nothing
          console.log(error)
        }
      }
      if (outputsToAdmit.length === 0) {
        const e = new Error(
          'This transaction does not publish a valid TSP Advertisement descriptor!'
        )
        e.code = 'ERR_INVALID_ADVERTISEMENT'
        throw e
      }

      // Returns an array of vouts admitted
      // And previousOutputsRetained (all in this case)
      return {
        outputsToAdmit,
        outputsToRetain: previousUTXOs.map(x => x.id)
      }
    } catch (error) {
      return []
    }
  }
}
module.exports = KVStoreTopicManager
