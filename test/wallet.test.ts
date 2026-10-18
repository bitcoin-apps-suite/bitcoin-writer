import { describe, expect, it } from 'vitest';
import { Hash, P2PKH, PrivateKey, ProtoWallet, PublicKey, Spend, Transaction, UnlockingScript, Utils, type WalletInterface } from '@bsv/sdk';
import { CHAIN_PROTOCOL, chainKeyID, chainPublicKey, createActionArgs, decryptContent, encryptContent, signChainInput, type WalletPlan } from '../lib/writer/wallet-tx';
import { CHAIN_DUST, parseCommitTx, saveDataScript, type SaveFields } from '../lib/writer/chainproof';
import { createChallenge, verifySignIn } from '../lib/writer/bwalletx-auth';

const KEY_ID = '0123456789abcdef0123456789abcdef';
const root = PrivateKey.fromRandom();
const wallet = new ProtoWallet(root) as unknown as WalletInterface;
const other = new ProtoWallet(PrivateKey.fromRandom()) as unknown as WalletInterface;

describe('wallet encryption (BRC-2, protocol [1, "bitcoin writer"], keyID = key_id)', () => {
  it('round-trips and is bound to the wallet and the document', async () => {
    const body = Array.from(new TextEncoder().encode(JSON.stringify({ v: 1, title: 't', html: '<p>hi</p>' })));
    const ct = await encryptContent(wallet, KEY_ID, body);
    expect(ct).not.toEqual(body);
    expect(await decryptContent(wallet, KEY_ID, ct)).toEqual(body);
    await expect(decryptContent(wallet, 'ffffffffffffffffffffffffffffffff', ct)).rejects.toThrow();
    await expect(decryptContent(other, KEY_ID, ct)).rejects.toThrow();
  });
});

function fields(over: Partial<SaveFields> = {}): SaveFields {
  return { version: 1, content_hash: 'aa', author: 'x', word_count: 1, char_count: 2, branch: 'main', ts: 1, key_id: KEY_ID, message: 'm', ...over };
}

describe('save transaction', () => {
  it('HandCash data script is unchanged (no enc field), wallet script carries enc=brc2 and no iv', () => {
    const hc = parseCommitTx(txWith(saveDataScript([1, 2, 3], fields({ iv: 'AAAAAAAAAAAAAAAA' }))).toHex())!;
    expect(hc.type).toBe('chainproof');
    if (hc.type !== 'chainproof') return;
    expect(hc.fields.enc).toBeUndefined();
    expect(hc.fields.iv).toBe('AAAAAAAAAAAAAAAA');
    const w = parseCommitTx(txWith(saveDataScript([1, 2, 3], fields({ enc: 'brc2' }))).toHex())!;
    if (w.type !== 'chainproof') throw new Error('type');
    expect(w.fields.enc).toBe('brc2');
    expect(w.fields.iv).toBeUndefined();
    expect(w.ciphertext).toEqual([1, 2, 3]);
  });

  it('createAction keeps output order and spends the previous chain UTXO', () => {
    const plan = samplePlan('00'.repeat(32));
    const args = createActionArgs(plan);
    expect(args.options?.randomizeOutputs).toBe(false);
    expect(args.inputs?.[0]).toMatchObject({ outpoint: `${'00'.repeat(32)}.0`, unlockingScriptLength: 108 });
    expect(args.outputs?.map((o) => o.satoshis)).toEqual([546, 0]);
    expect(createActionArgs({ ...plan, prev: null, inputBEEF: null }).inputs).toBeUndefined();
  });

  it('signs the chain input with the wallet-derived key so the script verifies', async () => {
    // Previous save: chain UTXO locked to the wallet's derived chain key.
    const chainAddress = PublicKey.fromString(await chainPublicKey(wallet, KEY_ID)).toAddress();
    const funding = PrivateKey.fromRandom();
    const fundSrc = new Transaction();
    fundSrc.addOutput({ lockingScript: new P2PKH().lock(funding.toAddress()), satoshis: 10_000 });
    const prevTx = new Transaction();
    prevTx.addInput({ sourceTransaction: fundSrc, sourceOutputIndex: 0, unlockingScriptTemplate: new P2PKH().unlock(funding) });
    prevTx.addOutput({ lockingScript: new P2PKH().lock(chainAddress), satoshis: CHAIN_DUST });
    await prevTx.sign();

    // What a wallet hands back from createAction: our input first, plus its own funding input + change.
    const walletFund = new Transaction();
    walletFund.addOutput({ lockingScript: new P2PKH().lock(funding.toAddress()), satoshis: 5_000 });
    const next = new Transaction();
    next.addInput({ sourceTransaction: prevTx, sourceOutputIndex: 0, sequence: 0xffffffff, unlockingScript: new UnlockingScript() });
    next.addInput({ sourceTransaction: walletFund, sourceOutputIndex: 0, sequence: 0xffffffff, unlockingScript: new UnlockingScript() });
    next.addOutput({ lockingScript: new P2PKH().lock(chainAddress), satoshis: CHAIN_DUST });
    next.addOutput({ lockingScript: saveDataScript([9], fields({ version: 2, enc: 'brc2' })), satoshis: 0 });
    next.addOutput({ lockingScript: new P2PKH().lock(funding.toAddress()), satoshis: 4_000 });

    const plan: WalletPlan = { ...samplePlan(prevTx.id('hex')), prev: { txid: prevTx.id('hex'), vout: 0, satoshis: CHAIN_DUST, lockingScript: prevTx.outputs[0].lockingScript.toHex() } };
    const { index, unlockingScript } = await signChainInput(wallet, next.toAtomicBEEF(true), KEY_ID, plan.prev!);
    expect(index).toBe(0);

    next.inputs[0].unlockingScript = UnlockingScript.fromHex(unlockingScript);
    const spend = new Spend({
      sourceTXID: prevTx.id('hex'),
      sourceOutputIndex: 0,
      sourceSatoshis: CHAIN_DUST,
      lockingScript: prevTx.outputs[0].lockingScript,
      transactionVersion: next.version,
      otherInputs: [next.inputs[1]],
      outputs: next.outputs,
      inputIndex: 0,
      unlockingScript: next.inputs[0].unlockingScript!,
      inputSequence: 0xffffffff,
      lockTime: next.lockTime,
    });
    expect(spend.validate()).toBe(true);

    // A different wallet cannot produce a valid spend.
    const bad = await signChainInput(other, next.toAtomicBEEF(true), KEY_ID, plan.prev!);
    const badSpend = new Spend({ ...(spend as any), unlockingScript: UnlockingScript.fromHex(bad.unlockingScript), sourceTXID: prevTx.id('hex'), sourceOutputIndex: 0, sourceSatoshis: CHAIN_DUST, lockingScript: prevTx.outputs[0].lockingScript, transactionVersion: next.version, otherInputs: [next.inputs[1]], outputs: next.outputs, inputIndex: 0, inputSequence: 0xffffffff, lockTime: next.lockTime });
    expect(() => badSpend.validate()).toThrow();
    expect(CHAIN_PROTOCOL).toEqual([2, 'bitcoin writer chain']);
    expect(chainKeyID(KEY_ID)).toBe(`${KEY_ID}/chain`);
    expect(Hash.hash256([1]).length).toBe(32);
  });
});

describe('sign in with a BRC-100 wallet (stateless challenge)', () => {
  const origin = 'https://bitcoin-writer.vercel.app';
  const secret = 'test-secret-test-secret-test-secret';
  it('accepts the wallet signature and rejects tampering, other origins and expiry', async () => {
    const { publicKey: ik } = await wallet.getPublicKey({ identityKey: true });
    const c = createChallenge(origin, ik, Date.now(), secret);
    expect(c.nonce.length).toBeLessThanOrEqual(64);
    const { signature } = await wallet.createSignature({ protocolID: c.protocolID, keyID: c.keyID, counterparty: 'anyone', data: Utils.toArray(c.message, 'utf8') });
    const input = { identityKey: ik, nonce: c.nonce, signature: Array.from(signature) };
    expect(await verifySignIn(origin, input, Date.now(), secret)).toBe(ik);
    expect(await verifySignIn('https://evil.example', input, Date.now(), secret)).toBeNull();
    expect(await verifySignIn(origin, input, Date.now() + 3 * 60_000, secret)).toBeNull();
    expect(await verifySignIn(origin, { ...input, nonce: c.nonce.replace(/.$/, (x) => (x === 'A' ? 'B' : 'A')) }, Date.now(), secret)).toBeNull();
    const { publicKey: otherIk } = await other.getPublicKey({ identityKey: true });
    expect(await verifySignIn(origin, { ...input, identityKey: otherIk }, Date.now(), secret)).toBeNull();
  });
});

function txWith(script: ReturnType<typeof saveDataScript>) {
  const tx = new Transaction();
  tx.addInput({ sourceTXID: '11'.repeat(32), sourceOutputIndex: 0, unlockingScript: new UnlockingScript(), sequence: 0xffffffff });
  tx.addOutput({ lockingScript: new P2PKH().lock(PrivateKey.fromRandom().toAddress()), satoshis: CHAIN_DUST });
  tx.addOutput({ lockingScript: script, satoshis: 0 });
  return tx;
}

function samplePlan(prevTxid: string): WalletPlan {
  return {
    kind: 'save',
    keyId: KEY_ID,
    description: 'Bitcoin Writer save',
    prev: { txid: prevTxid, vout: 0, satoshis: CHAIN_DUST, lockingScript: '' },
    inputBEEF: '00',
    outputs: [
      { lockingScript: '76a914' + '00'.repeat(20) + '88ac', satoshis: CHAIN_DUST, outputDescription: 'Bitcoin Writer chain UTXO' },
      { lockingScript: '006a', satoshis: 0, outputDescription: 'Bitcoin Writer encrypted save' },
    ],
    quote: { minerSats: 1, serviceSats: 0, fundingSats: 547, totalSats: 547, bytes: 300 },
  };
}
