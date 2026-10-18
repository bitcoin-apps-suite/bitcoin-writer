import { afterEach, describe, expect, it, vi } from 'vitest';
import { LockingScript, PrivateKey, ProtoWallet, PublicKey, Transaction, Utils, type WalletInterface } from '@bsv/sdk';
import { planWalletSave } from '@/lib/writer/wallet-chain';
import { parseCommitTx } from '@/lib/writer/chainproof';
import { chainPublicKey, createActionArgs, encryptContent } from '@/lib/writer/wallet-tx';

const KEY_ID = 'fedcba9876543210fedcba9876543210';
const wallet = new ProtoWallet(PrivateKey.fromRandom()) as unknown as WalletInterface;

afterEach(() => vi.unstubAllGlobals());

describe('planWalletSave (dry run: no wallet spend, no broadcast)', () => {
  it('plans a genesis save the wallet can fund, in the existing CHAINPROOF format', async () => {
    vi.stubGlobal('fetch', async () => new Response('{}', { status: 503 })); // fee rate falls back to 0.05 sat/B
    const { publicKey: identityKey } = await wallet.getPublicKey({ identityKey: true });
    const chainPub = await chainPublicKey(wallet, KEY_ID);
    const ciphertext = await encryptContent(wallet, KEY_ID, Utils.toArray(JSON.stringify({ v: 1, title: 'T', html: '<p>x</p>' }), 'utf8'));

    const plan = await planWalletSave(
      { wallet: 'bwalletx', identityKey, authToken: '', handle: identityKey, exp: Date.now() + 1000 },
      chainPub,
      { keyId: KEY_ID, prev: null, branch: 'main', message: 'first', ciphertext: Utils.toBase64(ciphertext), wordCount: 1, charCount: 1, enc: 'brc2', iv: '' }
    );

    expect(plan.prev).toBeNull();
    expect(plan.outputs[0].satoshis).toBe(546);
    expect(plan.outputs[0].lockingScript).toBe(new (await import('@bsv/sdk')).P2PKH().lock(PublicKey.fromString(chainPub).toAddress()).toHex());
    expect(plan.quote.totalSats).toBeGreaterThan(546);
    expect(plan.outputs.length).toBe(process.env.WRITER_SERVICE_ADDRESS ? 3 : 2);

    // Build the transaction the wallet would make (our outputs in order + its change) and parse it back.
    const tx = new Transaction();
    tx.addInput({ sourceTXID: '22'.repeat(32), sourceOutputIndex: 0, unlockingScript: LockingScript.fromHex('00') as any, sequence: 0xffffffff });
    for (const o of createActionArgs(plan).outputs!) tx.addOutput({ lockingScript: LockingScript.fromHex(o.lockingScript), satoshis: o.satoshis });
    const parsed = parseCommitTx(tx.toHex());
    expect(parsed?.type).toBe('chainproof');
    if (parsed?.type !== 'chainproof') return;
    expect(parsed.fields).toMatchObject({ version: 1, enc: 'brc2', author: identityKey, key_id: KEY_ID, branch: 'main', message: 'first' });
    expect(parsed.fields.iv).toBeUndefined();
    expect(parsed.ciphertext).toEqual(ciphertext);
  });

  it('refuses non-wallet sessions and unencrypted saves', async () => {
    vi.stubGlobal('fetch', async () => new Response('{}', { status: 503 }));
    const chainPub = await chainPublicKey(wallet, KEY_ID);
    const base = { keyId: KEY_ID, prev: null, message: '', ciphertext: Utils.toBase64([1]), wordCount: 0, charCount: 0, iv: '' };
    await expect(planWalletSave({ authToken: 'x', handle: 'h', exp: 0 }, chainPub, { ...base, enc: 'brc2' })).rejects.toThrow(/wallet/);
    await expect(planWalletSave({ wallet: 'bwalletx', identityKey: '02'.padEnd(66, '1'), authToken: '', handle: 'h', exp: 0 }, chainPub, base)).rejects.toThrow(/brc2/);
  });
});
