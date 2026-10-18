// Builds public/writer-wallet.js (client/writer-wallet.ts + @bsv/sdk) and copies the
// @bwalletx/connect browser bundle (wallet picker + phone pairing) to public/vendor/.
// Both outputs are generated; run by `pnpm dev` and `pnpm build`.
import { build } from 'esbuild';
import { copyFile, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const require = createRequire(import.meta.url);

await build({
  entryPoints: [path.join(root, 'client/writer-wallet.ts')],
  outfile: path.join(root, 'public/writer-wallet.js'),
  bundle: true,
  format: 'iife',
  platform: 'browser',
  target: 'es2020',
  minify: true,
  sourcemap: false,
  legalComments: 'none',
  logLevel: 'warning',
});

const connectPkg = path.dirname(require.resolve('@bwalletx/connect/package.json'));
await mkdir(path.join(root, 'public/vendor'), { recursive: true });
await copyFile(path.join(connectPkg, 'dist/bwalletx-connect.global.js'), path.join(root, 'public/vendor/bwalletx-connect.global.js'));
console.log('built public/writer-wallet.js and public/vendor/bwalletx-connect.global.js');
