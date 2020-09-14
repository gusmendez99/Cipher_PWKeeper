/*
*  Some functions from https://github.com/bitwiseshiftleft/sjcl library
*/

const {
	HMAC,
	PBKDF2,
	SHA256,
	compareBitArrays,
	decryptWithGCM,
	encryptwithGCM,
	paddedBitArrayToString,
	bitArraySlice,
	stringToBitArray,
	setupCipher,
	stringToPaddedBitArray,
	getBitArrayLength,
	concatBitArray,
} = require("../utils/utils.min");

const {
	KEYCHAIN_STATE_OFF,
	KEYCHAIN_STATE_ON,
	MAX_PASSWORD_LENGTH_BYTES,
	KEY_NONCES, 
	PBKDF2_SALT
} = require("./constants");

const omit = require("lodash/omit");

class KeyChain {
	constructor() {
		this.state = KEYCHAIN_STATE_OFF;
		this.keys = {};
		this.data = {};
		this.credentials = {}
	}

	init(password) {
		const masterKey = PBKDF2(password, PBKDF2_SALT);
		const hmacKey = HMAC(masterKey, KEY_NONCES.HMAC_SECRET);
		const gcmKey = HMAC(masterKey, KEY_NONCES.GCM_SECRET);
		const authKey = HMAC(hmacKey, KEY_NONCES.AUTH_SECRET);

		this.keys = { masterKey, hmacKey, gcmKey };
		this.data = { authKey };
		this.state = KEYCHAIN_STATE_ON;
	}

	load(password, representation, trustedDataCheck) {
		if (trustedDataCheck == undefined || !compareBitArrays(stringToBitArray(SHA256(stringToBitArray(representation))), stringToBitArray(trustedDataCheck))) throw "Representation and SHA256 hash have different values, integrity error...";


		const deserialized = JSON.parse(representation);
		const dataDeserialized = JSON.parse(deserialized.substr(0, deserialized.indexOf("#")))
		const credentialsDeserialized = JSON.parse(deserialized.substr(deserialized.indexOf("#") + 1, deserialized.length))
		this.data = dataDeserialized;
		this.credentials = credentialsDeserialized;
		const masterKey = PBKDF2(password, PBKDF2_SALT);
		
		const hmacKey = HMAC(masterKey, KEY_NONCES.HMAC_SECRET);
		const gcmKey = HMAC(masterKey, KEY_NONCES.GCM_SECRET);
		const authKey = HMAC(masterKey, KEY_NONCES.AUTH_SECRET);

		this.data = { authKey }
		this.keys = { masterKey, hmacKey, gcmKey };
		this.state = KEYCHAIN_STATE_ON;
		return true;
	}

	dump() {
		if (this.state === KEYCHAIN_STATE_OFF) return null;

	  let representation = JSON.stringify(this.data);
	  representation = representation.concat('#');
		representation = representation.concat(JSON.stringify(this.credentials));
		const representationAsString = JSON.stringify(representation)
	  return [representationAsString, SHA256(stringToBitArray(representationAsString))];
	}

	get(name) {
		if (this.state === KEYCHAIN_STATE_OFF)
			throw "Keychain not initialized.";
		const { hmacKey, masterKey, gcmKey } = this.keys;
		const hmacDomain = HMAC(hmacKey, name);
		const cipherText = this.credentials[hmacDomain];
		if(!cipherText) return null;

		const cipher = setupCipher(bitArraySlice(gcmKey, 0, 128));
		const decrypted = decryptWithGCM(cipher, cipherText);
		const decryptedPassword = bitArraySlice(decrypted, 0, getBitArrayLength(decrypted) - getBitArrayLength(hmacDomain))
		const authHmac = bitArraySlice(decrypted, getBitArrayLength(decrypted) - getBitArrayLength(hmacDomain), getBitArrayLength(decrypted))

		if(!compareBitArrays(hmacDomain, authHmac)) throw "Attack detected...";
		const password = paddedBitArrayToString(decryptedPassword, MAX_PASSWORD_LENGTH_BYTES)
		return password;
	}

	set(name, value) {
		if (this.state === KEYCHAIN_STATE_OFF)
			throw "Keychain not initialized.";
		const { hmacKey, gcmKey } = this.keys;
		const hmacDomain = HMAC(hmacKey, name);
		const cipher = setupCipher(bitArraySlice(gcmKey, 0, 128))
		const paddedPassword = concatBitArray(stringToPaddedBitArray(value, MAX_PASSWORD_LENGTH_BYTES), hmacDomain)
		const cipherText = encryptwithGCM(cipher, paddedPassword);
		this.credentials[hmacDomain] = cipherText;
	}

	remove(name) {
		if (this.state === KEYCHAIN_STATE_OFF)
			throw "Keychain not initialized.";
		const hmacDomain = HMAC(this.keys.hmacKey, name);
		if(!this.credentials[hmacDomain]) return false;
		this.credentials = omit(this.credentials, [hmacDomain]);
		return true;
	}
}

module.exports.KeyChain = KeyChain;
