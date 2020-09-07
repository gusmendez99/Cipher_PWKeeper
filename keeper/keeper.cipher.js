const { random, misc, hash, cipher, mode, bitArray } = require("sjcl");

const generateRandomArray = (length) => {
	if (length % 32 != 0) throw "Length is not valid...";
	return random.randomWords(length / 32, 0);
};
const PBKDF2 = (password, salt) => misc.pbkdf2(password, salt, 25000);
const HMAC = (key, data) => new misc.hmac(key).encrypt(data);
const SHA256 = (array) => hash.sha256.hash(array);
const cipherState = (secret) => {
	if (bitArray.bitLength(secret) == 128) return new cipher.aes(secret);
	throw "Cipher state is not AES-128...";
};
const encryptGCM = (secret, text) => {
	const initializationVector = generateRandomArray(128);
	const array = mode.gcm.encrypt(secret, text, initializationVector);
	return bitArray.concat(initializationVector, array);
};
const decryptGCM = (secret, ciphertext) => {
	const initializationVector = bitArray.bitSlice(ciphertext, 0, 128);
	const sliced = bitArray.bitSlice(ciphertext, 128);
	return mode.gcm.decrypt(secret, sliced, initializationVector);
};


module.exports = {
	HMAC, 
	PBKDF2, 
	SHA256, 
	cipherState, 
	decryptGCM, 
	encryptGCM, 
	generateRandomArray
}