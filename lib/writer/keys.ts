/**
 * Per-document keys derived (BRC-42) from the user's HandCash encryption keypair.
 *
 * Every key a document needs can be re-derived from the HandCash login plus the document's
 * public `key_id` (stored in its CHAINPROOF metadata), so nothing is custodied by the server:
 *   - chain key:   locks the 546-sat chain UTXO; whoever holds it can make the next save
 *   - funding key: receives the user's HandCash payment that funds one save/fork transaction
 *   - content key: AES-256-GCM key for the document's encrypted content
 */

import { KeyDeriver, PrivateKey, type WalletProtocol } from '@bsv/sdk';

const CHAIN_PROTOCOL: WalletProtocol = [2, 'bitcoin writer chain'];
const CONTENT_PROTOCOL: WalletProtocol = [2, 'bitcoin writer content'];

export const KEY_ID_PATTERN = /^[0-9a-f]{32}$/;
export const FUND_ID_PATTERN = /^[0-9a-f]{16}$/;

export function documentKeys(root: PrivateKey, keyId: string) {
  if (!KEY_ID_PATTERN.test(keyId)) throw new Error('Invalid key_id');
  const deriver = new KeyDeriver(root);
  return {
    chainKey: deriver.derivePrivateKey(CHAIN_PROTOCOL, `${keyId}/chain`, 'self'),
    fundingKey: (fundId: string) => {
      if (!FUND_ID_PATTERN.test(fundId)) throw new Error('Invalid funding id');
      return deriver.derivePrivateKey(CHAIN_PROTOCOL, `${keyId}/fund/${fundId}`, 'self');
    },
    contentKey: () => deriver.deriveSymmetricKey(CONTENT_PROTOCOL, keyId, 'self').toArray('be', 32),
  };
}
