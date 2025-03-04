import { PublicKey } from '@solana/web3.js';

export type Seed = string | PublicKey | Uint8Array | Buffer;

export function encodeSeeds(seedsArg: Seed[]): Buffer {
  const seeds: Buffer[] = seedsArg.map((seed) => {
    switch (true) {
      case typeof seed === 'string': {
        const s = seed as string;
        return Buffer.from(seed);
      }
      case seed instanceof PublicKey: {
        const s = seed as PublicKey;
        return s.toBuffer();
      }
      case seed instanceof Uint8Array: {
        const s = seed as Uint8Array;
        return Buffer.from(s);
      }
      default:
        return seed as Buffer;
    }
  });

  let seedEncoded = Buffer.alloc(
    1 + seeds.map((seed) => seed.length + 1).reduce((a, b) => a + b, 0)
  );
  seedEncoded.writeUInt8(seeds.length);
  let offset = 1;
  seeds.forEach((seed) => {
    seedEncoded.writeUInt8(seed.length, offset);
    offset += 1;
    seed.copy(seedEncoded, offset);
    offset += seed.length;
  });
  return seedEncoded;
}

export function pubKeyToHex(publicKey: PublicKey): string {
  return '0x' + publicKey.toBuffer().toString('hex');
}

export function numToPaddedHex(num: number) {
  const str = num.toString(16);
  const pad = 16 > str.length ? '0'.repeat(16 - str.length) : '';
  return pad + str;
}
