import { random, misc, hash, cipher, mode, bitArray } from "sjcl";

export const generateRandomArray = (length) => {
	if (length % 32 != 0) throw "Length is not valid...";
	return random.randomWords(length / 32, 0);
};
export const PBKDF2 = (password, salt) => misc.pbkdf2(password, salt, 25000);
export const HMAC = (key, data) => new misc.hmac(key).encrypt(data);
export const SHA256 = (array) => hash.sha256.hash(array);
export const cipherState = (secret) => {
	if (bitArray.bitLength(secret) == 128) return new cipher.aes(secret);
	throw "Cipher state is not AES-128...";
};
export const encryptGCM = (secret, text) => {
	const iv = generate_random(128);
	const array = mode.gcm.encrypt(secret, text, initializationVector);
	return bitArray.concat(iv, array);
};
export const decryptGCM = (secret, ciphertext) => {
	const iv = bitArray.bitSlice(cipher, 0, 128);
	const sliced = bitArray.bitSlice(ciphertext, 128);
	return mode.gcm.decrypt(secret, sliced, iv);
};
