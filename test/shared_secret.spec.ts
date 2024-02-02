import * as secp from "@noble/secp256k1";
import { generateSharedSecret } from "../src/shared_secret";

const alicePriv = new Uint8Array([
    250, 54, 42, 69, 214, 70, 77, 20,
    135, 187, 147, 247, 39, 15, 200, 85,
    169, 168, 221, 176, 136, 131, 104, 187,
    23, 78, 134, 227, 48, 33, 122, 213
]);
const bobPriv = new Uint8Array([
    155, 201, 129, 184, 127, 9, 133, 135,
    117, 203, 79, 109, 70, 215, 20, 12,
    224, 14, 7, 43, 123, 202, 54, 29,
    132, 162, 186, 61, 243, 227, 39, 230
]);

test("secp example", async () => {
    const alicePub = secp.getPublicKey(alicePriv, false)
    const bobPub = secp.getPublicKey(bobPriv, false)

    const sharedSecretAlice = secp.getSharedSecret(alicePriv, bobPub, true);
    const sharedSecretBob = secp.getSharedSecret(bobPriv, alicePub, true);
    expect(sharedSecretAlice).toEqual(sharedSecretBob)
});

test("getSharedSecret default case", async () => {
    const shouldSecret = new Uint8Array([
        216, 249,   8,  21, 131, 130, 217,  98,
        141, 252, 212, 103,  97, 178, 150,  89,
        165, 180,  76, 128, 183, 139, 229, 149,
         10,  78, 235,   2,  83, 209, 217,   0
      ])
    const alicePub = secp.getPublicKey(alicePriv, true)
    const aliceNodeId = Buffer.from(alicePub).toString('hex')
    const bobPub = secp.getPublicKey(bobPriv, true)
    const bobNodeId = Buffer.from(bobPub).toString('hex')


    const sharedSecretAlice = generateSharedSecret(alicePriv, bobNodeId);
    const sharedSecretBob = generateSharedSecret(bobPriv, aliceNodeId);
    
    expect(sharedSecretAlice).toEqual(sharedSecretBob)
    expect(sharedSecretAlice).toEqual(shouldSecret)
});

test("getSharedSecret derivation", async () => {
    const alicePub = secp.getPublicKey(alicePriv, true)
    const aliceNodeId = Buffer.from(alicePub).toString('hex')
    const bobPub = secp.getPublicKey(bobPriv, true)
    const bobNodeId = Buffer.from(bobPub).toString('hex')
    const derivationName = "ufo"

    const underivedSecret = generateSharedSecret(alicePriv, bobNodeId)
    const sharedSecretAlice = generateSharedSecret(alicePriv, bobNodeId, derivationName);
    const sharedSecretBob = generateSharedSecret(bobPriv, aliceNodeId, derivationName);
    
    expect(sharedSecretAlice).toEqual(sharedSecretBob)
    expect(sharedSecretAlice).not.toEqual(underivedSecret)
});

